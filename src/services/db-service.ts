import { db } from './firebase-config';
import { PersonaData } from '../components/PersonaView';

export const savePersona = async (userId: string, data: PersonaData) => {
    try {
        // Compat syntax: db.collection().doc().set()
        await db.collection("personas").doc(userId).set(data);
        console.log("Persona saved!");
        return true;
    } catch (error) {
        console.error("Error saving persona:", error);
        alert("Failed to save. Check your Firebase Config and Firestore Rules.");
        return false;
    }
};

export const getPersona = async (userId: string): Promise<PersonaData | null> => {
    try {
        const docRef = db.collection("personas").doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return docSnap.data() as PersonaData;
        } else {
            console.log("No persona found for this user.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching persona:", error);
        return null;
    }
};
