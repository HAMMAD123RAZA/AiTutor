import { collection, addDoc, serverTimestamp, getDocs, where, query, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export const apiUsage = async (uid, routeName, userEmail,type) => {
  try {
    const usageRef = collection(db, "API_TRACK") 
    await addDoc(usageRef, {
      uid,
      routeName,
      userEmail,
      createdAt: serverTimestamp(), 
      type
    })

    console.log("✅ API usage logged successfully")
    return true
  } catch (error) {
    console.error("❌ Error logging API usage:", error)
    return false
  }
}


export const getAllApiUsage = async () => {
  try {
    const usageRef = collection(db, "API_TRACK")
    const snapshot = await getDocs(usageRef)

    // Map snapshot into plain JS objects
    const data = snapshot.docs.map(doc => ({
      id: doc.id,  // doc id
      ...doc.data()
    }))

    console.log("✅ All API usage:", data)
    return data
  } catch (error) {
    console.error("❌ Error fetching API usage:", error)
    return []
  }
}


export const courseCreatedUsage=async(userId,userEmail,courseId,generatedAt,prompt,type)=>{
const usageRef=collection(db, "Course_Created")
try {
  await addDoc(usageRef, {
    userId,
    userEmail,
    courseId,
    generatedAt,
    prompt,
    type,
    createdAt: serverTimestamp(),
  })
  console.log("✅ Course created usage logged successfully")
  return true
} catch (error) {
  console.error("❌ Error logging course created usage:", error)
  return false
}

}

export const getCourseCreatedUsage=async()=>{
  try {
    const usageRef=collection(db, "Course_Created")
    const snapshot=await getDocs(usageRef)
    const data=snapshot.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))
    console.log("✅ All course created usage:", data)
    return data
  } catch (error) {
    console.error("❌ Error fetching course created usage:", error)
    return []
  }
}


//client
export const addUser = async (name, email, password, totalCredits, plan, creditUsed,role) => {
  try {
    const userRef = collection(db, "USERS");

    const docRef = await addDoc(userRef, {
      name,
      email,
      password, 
      totalCredits,
      plan,
      creditUsed,
      role:role,
      createdAt: serverTimestamp(),
      loggedInAt:serverTimestamp()
    });
    console.log('docref user :',docRef.id)
    return true;
  } catch (error) {
    console.error("❌ Error adding user:", error);
    return false;
  }
};

export const getUsers=async()=>{
  try {
    const usageRef=collection(db, "USERS")
    const snapshot=await getDocs(usageRef)
    const data=snapshot.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))
    console.log("✅ All Users:", data)
    return data
  } catch (error) {
    console.error("❌ Error fetching Users:", error)
    return []
  }
}


export const getCourses = async (userId) => {
  try {
    const q = query(
      collection(db, "Course_Created"),
      where("userId", "==", userId)
    )

    const snapshot = await getDocs(q)

    // Convert docs to array
    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return courses
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

export const getTotalCalls = async (userId) => {
  try {
    const q = query(
      collection(db, "API_TRACK"),
      where("uid", "==", userId),
      where("type", "==", "Valuable"),
      where("routeName", "==", "/python/speak")
    )

    const snapshot = await getDocs(q)

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return results
  } catch (error) {
    console.error("Error fetching API data:", error)
    return []
  }
}


export const trackLogin = async (email) => {
  try {
    const q = query(collection(db, "USERS"), where("email", "==", email));
    const snapshot = await getDocs(q);

    snapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, {
        loggedInAt: serverTimestamp()
      });
    });

    console.log("✅ Login time updated");
  } catch (error) {
    console.error("❌ Error updating login time", error);
  }
};

