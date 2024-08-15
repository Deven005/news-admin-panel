"use client";
import AddUpdateReporterForm from "@/app/components/admin/reporter/AddUpdateReporterForm";
import { firestore } from "@/app/firebase/config";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Reporter } from "@/app/store/models/reporter/reporterModel";
import { reporterCollectionName } from "@/app/Utils/Utils";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function Reporters() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditReporter, setIsEditReporter] = useState(false);
  const token = useStoreState((state) => state.auth.token);
  const reporters = useStoreState((state) => state.reporter.reporters);
  const deleteReporter = useStoreActions(
    (state) => state.reporter.deleteReporter
  );
  const updateReporter = useStoreActions(
    (state) => state.reporter.updateReporter
  );
  const addReporter = useStoreActions((state) => state.reporter.addReporter);
  const [reporterToEditOrDelete, setReporterToEditOrDelete] =
    useState<Reporter>();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(firestore, reporterCollectionName),
      async (snapshot) => {
        setIsLoading(true);
        snapshot.docChanges().forEach((change) => {
          var changedReporterIndex: number = reporters.findIndex(
            (val) => val.reporterID == change.doc.id
          );

          const reporterData = change.doc.data();

          console.log("changedReporterIndex: ", changedReporterIndex);

          if (change.type === "added" && changedReporterIndex == -1) {
            addReporter({
              reporterID: reporterData["reporterID"] ?? change.doc.id,
              reporterFirstName: reporterData["reporterFirstName"],
              reporterLastName: reporterData["reporterLastName"],
              reporterEmail: reporterData["reporterEmail"],
            } as Reporter);
          } else if (change.type === "modified") {
            if (changedReporterIndex !== -1) {
              // Handle modified document
              updateReporter({ changedReporterIndex, reporterData });
            }
          } else if (change.type === "removed" && changedReporterIndex !== -1) {
            // Handle removed document
            deleteReporter(changedReporterIndex);
          }
        });
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  function editReporterClickHandler(reporter: Reporter) {
    setReporterToEditOrDelete(reporter);
    setIsEditReporter(true);
    setIsModalOpen(true);
  }

  return isLoading ? (
    <p className="text-center pt-20">Loading...</p>
  ) : (
    <>
      <button className="btn text-right" onClick={() => setIsModalOpen(true)}>
        Add Reporter
      </button>

      {isModalOpen && (
        <AddUpdateReporterForm
          token={token}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEditReporter={isEditReporter}
          setIsEditReporter={setIsEditReporter}
          reporterToEditOrDelete={reporterToEditOrDelete}
          setReporterToEditOrDelete={setReporterToEditOrDelete}
        />
      )}

      {reporters && reporters.length == 0 ? (
        <p>No data to show!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra text-center">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {reporters.map((reporter, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{reporter.reporterFirstName}</td>
                    <td>{reporter.reporterLastName}</td>
                    <td>{reporter.reporterEmail}</td>
                    <td>
                      <button
                        className="btn btn-outline"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        onClick={() => editReporterClickHandler(reporter)}
                      >
                        Edit
                      </button>
                    </td>
                    {/* <td>
                          <button
                            className="btn btn-outline btn-error"
                            data-te-ripple-init
                            data-te-ripple-color="dark"
                            // onClick={() => deleteCategoryClickHandler(cat)}
                          >
                            Delete
                          </button>
                        </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Reporters;
