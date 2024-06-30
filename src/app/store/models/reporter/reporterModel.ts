import { action, Action } from "easy-peasy";
import { DocumentData } from "firebase/firestore";

interface Reporter {
  reporterID: string;
  reporterFirstName: string;
  reporterLastName: string;
  reporterEmail: string;
}

interface UpdateReporter {
  changedReporterIndex: number;
  reporterData: DocumentData;
}

export interface ReporterModel {
  reporters: Reporter[];
  addReporter: Action<ReporterModel, Reporter>;
  updateReporter: Action<ReporterModel, UpdateReporter>;
  deleteReporter: Action<ReporterModel, number>;
  //   token: string;
  //   user: User | undefined;
  //   login: Thunk<AuthModel, LoginInputModel, Promise<void>>;
  //   loginSuccess: Action<AuthModel, any>;
  //   setToken: Action<AuthModel, string>;
  //
  //   logout: () => void;
}

const reporterModel: ReporterModel = {
  reporters: [],
  addReporter: action((state, payload) => {
    state.reporters.push(payload);
  }),
  updateReporter: action((state, payload) => {
    const { changedReporterIndex, reporterData } = payload;
    var updateReporter = state.reporters[changedReporterIndex];
    updateReporter.reporterEmail = reporterData["reporterEmail"];
    updateReporter.reporterFirstName = reporterData["reporterFirstName"];
    updateReporter.reporterLastName = reporterData["reporterLastName"];
    state.reporters[changedReporterIndex] = updateReporter;
  }),
  deleteReporter: action((state, changedReporterIndex) => {
    state.reporters.splice(changedReporterIndex, 1);
  }),
};

export { reporterModel };
export type { Reporter };
