import * as edgeTTS from 'edge-tts';
import { Readable } from 'stream';

export const runtime = 'nodejs'; // avoid edge runtime

function nodeStreamToWeb(stream) {
  const reader = stream.getReader();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    cancel(reason) {
      reader.cancel(reason);
    },
  });
}

export async function POST(req) {
  try {
    const { text, voice = "en-US-AriaNeural", rate = "+0%" } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await edgeTTS.synthesize(text, { voice, rate });

    // Convert Node stream to Web-compatible ReadableStream
    const nodeReadable = Readable.from(result.stream);
    const webStream = nodeStreamToWeb(nodeReadable);

    return new Response(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=speech.mp3",
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    return new Response(JSON.stringify({ error: "TTS failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
