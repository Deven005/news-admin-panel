import { firestore, storage } from "@/app/firebase/config";
import { showToast } from "@/app/Utils/Utils";
import { thunk, action, Action, Thunk } from "easy-peasy";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  loading: boolean;
  setLoading: Action<EmergencyContactsModel, boolean>;
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
    { title: string; contactImg: File }
  >;
  updateEmergencyContactGroup: Thunk<
    EmergencyContactsModel,
    { groupId: string; title: string; contactImg: File | null }
  >;
  deleteEmergencyContactGroup: Thunk<
    EmergencyContactsModel,
    { groupId: string }
  >;
  setEmergencyContacts: Action<EmergencyContactsModel, EmergencyContact[]>;
}

const emergencyContactsModel: EmergencyContactsModel = {
  loading: false,
  emergencyContacts: [],

  addEmergencyContactGroup: thunk(
    async (actions, { title, contactImg }, { getState }) => {
      try {
        actions.setLoading(true);
        const newGroupRef = doc(collection(firestore, "emergencyContacts"));

        const storageRef = ref(
          storage,
          `emergencyContactGroup/${newGroupRef.id}`
        );
        await uploadBytes(storageRef, contactImg, {
          customMetadata: {
            size: contactImg.size.toString(),
            name: contactImg.name,
          },
        });

        await setDoc(newGroupRef, {
          contactTitle: title,
          contactImg: await getDownloadURL(storageRef),
          contacts: [],
        });
        showToast("Group added successfully!", "s");
      } catch (error) {
        showToast("Error adding group!", "e");
      } finally {
        actions.setLoading(false);
      }
    }
  ),

  updateEmergencyContactGroup: thunk(
    async (actions, { groupId, title, contactImg }, { getState }) => {
      try {
        actions.setLoading(true);

        // Prepare the document reference
        const groupDocRef = doc(firestore, "emergencyContacts", groupId);
        let newImageUrl = null;

        // If a new image is provided, upload it and get the URL
        if (contactImg) {
          const storageRef = ref(storage, `emergencyContactGroup/${groupId}`);
          await uploadBytes(storageRef, contactImg, {
            customMetadata: {
              size: contactImg.size.toString(),
              name: contactImg.name,
            },
          });
          newImageUrl = await getDownloadURL(storageRef);
        }

        // Update the Firestore document with new title and/or image URL
        await updateDoc(groupDocRef, {
          contactTitle: title,
          ...(newImageUrl && { contactImg: newImageUrl }),
        });

        // // Update state with new data
        // const updatedGroup = {
        //   id: groupId,
        //   contactTitle: title,
        //   contactImg:
        //     newImageUrl || (await getDoc(groupDocRef)).data().contactImg,
        //   contacts: (await getDoc(groupDocRef)).data().contacts,
        // };

        // actions.setEmergencyContacts(
        //   getState().emergencyContacts.map((cg) =>
        //     cg.id === groupId ? updatedGroup : cg
        //   )
        // );

        showToast("Group updated successfully!", "s");
      } catch (error) {
        showToast("Error updating group!", "e");
      } finally {
        actions.setLoading(false);
      }
    }
  ),

  deleteEmergencyContactGroup: thunk(
    async (actions, { groupId }, { getState }) => {
      try {
        actions.setLoading(true);

        await deleteDoc(doc(firestore, "emergencyContacts", groupId));

        // Update state immediately
        actions.setEmergencyContacts(
          getState().emergencyContacts.filter((cg) => cg.id !== groupId)
        );

        showToast("Group removed successfully!", "s");
      } catch (error) {
        showToast("Error removing group!", "e");
      } finally {
        actions.setLoading(false);
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

  setEmergencyContacts: action((state, contacts) => {
    state.emergencyContacts = contacts;
  }),

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export { emergencyContactsModel };
export type { EmergencyContact, EmergencyContactsModel };
