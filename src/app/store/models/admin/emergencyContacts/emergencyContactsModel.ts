import { firestore } from "@/app/firebase/config";
import { showToast } from "@/app/Utils/Utils";
import { thunk, action, Action, Thunk } from "easy-peasy";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

// Define the interface for a contact
interface Contact {
  contact: string;
  title: string;
}

// Define the interface for an emergency contact group
interface EmergencyContact {
  id: string; // Ensure 'id' is only defined once
  contactImg: string;
  contactTitle: string;
  contacts: Contact[];
}

// Define the model interface
interface EmergencyContactsModel {
  emergencyContacts: EmergencyContact[];
  listenEmergencyContacts: Thunk<EmergencyContactsModel>;
  updateContact: Thunk<
    EmergencyContactsModel,
    { groupId: string; contactIndex: number; title: string; contact: string }
  >;
  deleteContact: Thunk<
    EmergencyContactsModel,
    { groupId: string; contactIndex: number }
  >;
  addContact: Thunk<
    EmergencyContactsModel,
    { groupId: string; title: string; contact: string }
  >;
  addEmergencyContactGroup: Thunk<
    EmergencyContactsModel,
    { title: string; contactImg: string }
  >;
  deleteEmergencyContactGroup: Thunk<
    EmergencyContactsModel,
    { groupId: string }
  >;
  setEmergencyContacts: Action<EmergencyContactsModel, EmergencyContact[]>;
}

const emergencyContactsModel: EmergencyContactsModel = {
  emergencyContacts: [],

  addEmergencyContactGroup: thunk(
    async (actions, { title, contactImg }, { getState }) => {
      try {
        const newGroup = {
          contactTitle: title,
          contactImg,
          contacts: [],
        };
        const docRef = await addDoc(
          collection(firestore, "emergencyContacts"),
          newGroup
        );

        // Update state immediately
        // actions.setEmergencyContacts([
        //   ...getState().emergencyContacts,
        //   { id: docRef.id, ...newGroup },
        // ]);

        showToast("Group added successfully!", "s");
      } catch (error) {
        showToast("Error adding group!", "e");
      }
    }
  ),

  listenEmergencyContacts: thunk((actions) => {
    const unsubscribe = onSnapshot(
      collection(firestore, "emergencyContacts"),
      (snapshot) => {
        const updatedContacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EmergencyContact[];
        actions.setEmergencyContacts(updatedContacts);
      }
    );
    return () => unsubscribe();
  }),

  deleteEmergencyContactGroup: thunk(
    async (actions, { groupId }, { getState }) => {
      try {
        await deleteDoc(doc(firestore, "emergencyContacts", groupId));

        // Update state immediately
        actions.setEmergencyContacts(
          getState().emergencyContacts.filter((cg) => cg.id !== groupId)
        );

        showToast("Group removed successfully!", "s");
      } catch (error) {
        showToast("Error removing group!", "e");
      }
    }
  ),

  updateContact: thunk(
    async (
      actions,
      { groupId, contactIndex, title, contact },
      { getState }
    ) => {
      try {
        const contactGroup = getState().emergencyContacts.find(
          (cg) => cg.id === groupId
        );
        if (contactGroup) {
          contactGroup.contacts[contactIndex] = { title, contact };

          // Update Firestore
          const contactGroupDocRef = doc(
            firestore,
            "emergencyContacts",
            groupId
          );
          await updateDoc(contactGroupDocRef, {
            contacts: contactGroup.contacts,
          });

          // Update state immediately
          actions.setEmergencyContacts([...getState().emergencyContacts]);

          showToast("Contact updated successfully!", "s");
        }
      } catch (error) {
        showToast("Error updating contact!", "e");
      }
    }
  ),

  deleteContact: thunk(
    async (actions, { groupId, contactIndex }, { getState }) => {
      try {
        const contactGroup = getState().emergencyContacts.find(
          (cg) => cg.id === groupId
        );
        if (contactGroup) {
          contactGroup.contacts.splice(contactIndex, 1);

          // Update Firestore
          const contactGroupDocRef = doc(
            firestore,
            "emergencyContacts",
            groupId
          );
          await updateDoc(contactGroupDocRef, {
            contacts: contactGroup.contacts,
          });

          // Update state immediately
          actions.setEmergencyContacts([...getState().emergencyContacts]);

          showToast("Contact removed successfully!", "s");
        }
      } catch (error) {
        showToast("Error removing contact!", "e");
      }
    }
  ),

  addContact: thunk(
    async (actions, { groupId, title, contact }, { getState }) => {
      try {
        const contactGroup = getState().emergencyContacts.find(
          (cg) => cg.id === groupId
        );
        if (contactGroup) {
          const newContact = { title, contact };
          contactGroup.contacts.push(newContact);

          // Update Firestore
          const contactGroupDocRef = doc(
            firestore,
            "emergencyContacts",
            groupId
          );
          await updateDoc(contactGroupDocRef, {
            contacts: contactGroup.contacts,
          });

          // Update state immediately
          actions.setEmergencyContacts([...getState().emergencyContacts]);

          showToast("Contact added successfully!", "s");
        }
      } catch (error) {
        showToast("Error adding contact!", "e");
      }
    }
  ),

  setEmergencyContacts: action((state, contacts) => {
    state.emergencyContacts = contacts;
  }),
};

export { emergencyContactsModel };
export type { EmergencyContact, EmergencyContactsModel };
