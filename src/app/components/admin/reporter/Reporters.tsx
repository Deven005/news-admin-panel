"use client";
import AddUpdateReporterForm from "@/app/components/admin/reporter/AddUpdateReporterForm";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Reporter } from "@/app/store/models/reporter/reporterModel";
import { useState } from "react";
import Loading from "../../Loading";

function Reporters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditReporter, setIsEditReporter] = useState(false);
  const token = useStoreState((state) => state.auth.token);
  const { reporters, isLoading } = useStoreState((state) => state.reporter);
  const { deleteReporter } = useStoreActions((actions) => actions.reporter);
  const [reporterToEditOrDelete, setReporterToEditOrDelete] =
    useState<Reporter>();

  function editReporterClickHandler(reporter: Reporter) {
    setReporterToEditOrDelete(reporter);
    setIsEditReporter(true);
    setIsModalOpen(true);
  }

  return isLoading ? (
    <Loading />
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
                      <button
                        className="btn btn-outline btn-error ml-3"
                        data-te-ripple-init
                        data-te-ripple-color="dark"
                        onClick={() => deleteReporter(reporter.reporterID)}
                      >
                        Delete
                      </button>
                    </td>
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
