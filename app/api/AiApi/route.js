import dbConnect from "../../../lib/dbConn";
import Course from "../../../models/course";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const prompt = body.prompt;
    const userId=body.userId
    console.log('userId from aiapi:',userId)

    if (!prompt || prompt.trim() === '') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // STEP 1: Generate outline
    const outlineResponse = await generateCourseOutline(prompt);
    if (!outlineResponse.success) {
      return Response.json({ error: outlineResponse.error }, { status: 500 });
    }

    const moduleOutline = outlineResponse.data;

    // STEP 2: Generate modules sequentially (not in batches)
    const allModules = [];
    
    for (let moduleIdx = 0; moduleIdx < moduleOutline.length; moduleIdx++) {
      console.log(`Generating Module ${moduleIdx + 1}...`);
      
      const moduleResult = await generateSingleModule(
        prompt, 
        moduleOutline[moduleIdx], 
        moduleIdx + 1
      );
      
      if (!moduleResult.success) {
        return Response.json({ error: moduleResult.error }, { status: 500 });
      }
      
      allModules.push(moduleResult.data);
      
      // Add delay between modules to avoid rate limiting
      if (moduleIdx < moduleOutline.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Save course
    const courseId = Math.floor(100000 + Math.random() * 900000).toString();
    const courseContent = { modules: allModules };

    const newCourse = new Course({
      courseId,
      userIds:[userId],
      prompt,
      modules: allModules,
      content: JSON.stringify(courseContent),
      generatedAt: new Date(),
      generationMethod: 'sequential-generation'
    });

    const savedCourse = await newCourse.save();

    return Response.json({
      course: courseContent,
      id: courseId,
      dbId: savedCourse._id,
      metrics: {
        totalModules: allModules.length,
        generationMethod: 'sequential-generation'
      }
    });

  } catch (error) {
    console.error('Course generation error:', error);
    return Response.json({ error: 'Course generation failed' }, { status: 500 });
  }
}

// Generate a single module with all its submodules
async function generateSingleModule(mainPrompt, moduleOutline, moduleIndex) {
  const subModules = [];
  
  // Generate submodules sequentially, not concurrently
  for (let subIdx = 0; subIdx < 5; subIdx++) {
    console.log(`Generating Module ${moduleIndex}, Submodule ${subIdx + 1}...`);
    
    try {
      const submodule = await generateSubModuleContentWithRetry({
        moduleIndex,
        moduleTitle: moduleOutline.title,
        submoduleIndex: subIdx + 1,
        prompt: mainPrompt,
        submoduleTitle: `Submodule ${subIdx + 1}`,
        maxRetries: 3
      });
      
      subModules.push(submodule);
      
      // Small delay between submodules
      if (subIdx < 4) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
    } catch (error) {
      console.error(`Failed to generate Module ${moduleIndex}, Submodule ${subIdx + 1}:`, error);
      return { 
        success: false, 
        error: `Failed to generate Module ${moduleIndex}, Submodule ${subIdx + 1}: ${error.message}` 
      };
    }
  }

  return {
    success: true,
    data: {
      title: moduleOutline.title,
      subModules
    }
  };
}

// Enhanced submodule generation with retry logic
async function generateSubModuleContentWithRetry({ 
  moduleIndex, 
  moduleTitle, 
  submoduleIndex, 
  prompt, 
  submoduleTitle,
  maxRetries = 3 
}) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for Module ${moduleIndex}, Submodule ${submoduleIndex}`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
                    Authorization: `Bearer ${process.env.mongo_course}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are creating submodule ${submoduleIndex} titled "${submoduleTitle}" in module ${moduleIndex}: "${moduleTitle}" for a course about ${prompt}.`
            },
            {
              role: 'user',
              content: `Create comprehensive content for this submodule with:

1. Introduction paragraph (3-4 sentences)
2. Core concepts section with 2 key points
3. Code examples with explanations
4. Practical application
5. Summary and key takeaways

Format as HTML using:
- <h2> for main headings
- <h3> for sub-sections  
- <p> for paragraphs
- <pre><code> for code blocks
- <ul><li> for lists

Return ONLY this JSON structure:
{
  "title": "${submoduleTitle}",
  "content": "complete HTML content here"
}

Keep content focused and educational. Include working code examples where relevant to ${prompt}.`
            }
          ],
          temperature: 0.3,
          max_tokens: 3000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const raw = json.choices?.[0]?.message?.content;

      if (!raw || raw.trim() === '') {
        throw new Error(`Empty response from OpenRouter`);
      }

      // Parse JSON response
      let content;
      try {
        content = JSON.parse(raw);
      } catch (parseError) {
        console.error(`JSON parse error for Module ${moduleIndex}, Submodule ${submoduleIndex}:`, raw);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      // Validate response structure
      if (!content.title || !content.content) {
        throw new Error(`Invalid content structure - missing title or content`);
      }

      console.log(`✅ Successfully generated Module ${moduleIndex}, Submodule ${submoduleIndex}`);
      return content;

    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed for Module ${moduleIndex}, Submodule ${submoduleIndex}:`, error.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait longer between retries
        const waitTime = Math.pow(2, attempt) * 2000; // 4s, 8s, 16s
        console.log(`Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // If all retries failed, throw the last error
  throw new Error(`All ${maxRetries} attempts failed for Module ${moduleIndex}, Submodule ${submoduleIndex}: ${lastError.message}`);
}

// Generate course outline (unchanged but with better error handling)
async function generateCourseOutline(prompt) {
  const outlinePrompt = `Create a course outline for: ${prompt}

Generate exactly 7 modules with clear, descriptive titles.
Each module should cover a distinct aspect of the topic.

Return as JSON:
{
  "modules": [
    {
      "title": "Module 1: Clear Title",
      "description": "Brief description"
    }
  ]
}

Focus on logical progression from basics to advanced concepts.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${process.env.mongo_course}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert curriculum designer. Create well-structured course outlines.' 
          },
          { role: 'user', content: outlinePrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Outline API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    
    if (!raw) {
      throw new Error('Empty outline response');
    }
    
    const outline = JSON.parse(raw);
    
    if (!outline.modules || outline.modules.length !== 7) {
      throw new Error('Invalid outline structure');
    }

    return { success: true, data: outline.modules };
    
  } catch (error) {
    console.error('Outline generation error:', error);
    return { success: false, error: `Outline generation failed: ${error.message}` };
  }
}

