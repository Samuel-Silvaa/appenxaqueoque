import { get, patch, post, remove } from '../api';
import { Episode, EpisodeModalDTO, Patient, Report } from '../@types/app.types';
import { format, subDays } from 'date-fns';

export interface CreateReportDTO {
  startDate: string;
  endDate: string;
  patientId: string;
}

const requestCreateReport = async (
  payload: CreateReportDTO
): Promise<Episode> => post(`report`, payload);

const requestGeneratePdfReport = async (payload: {
  id: string;
  physicianEmail?: string;
}): Promise<Episode> => {
  return get(`report/chart/generate/${payload.id}`);
};

const requestCreateEpisode = async (
  payload: Episode,
  patientId: string
): Promise<Episode> => post(`episode/${patientId}`, payload);

const requestUpdateEpisode = async (
  payload: EpisodeModalDTO,
  episodeId: string
): Promise<Episode> => {
  try {
    const ep = Object.assign({}, payload);
    delete ep.id;
    delete ep.createdAt;
    delete ep.updatedAt;
    delete ep.email;
    delete ep.height;
    delete ep.kinship;
    delete ep.name;
    delete ep.patientId;
    delete ep.weight;
    return patch(`episode/${episodeId}`, ep);
  } catch (err) {
    console.log(err);
    throw Error();
  }
};

const requestFetchPatient = async (id: string): Promise<Patient> =>
  get(`patient/${id}`);

const requestFetchEpisodes = async (patientId: string): Promise<Episode[]> =>
  get(`episode/patient/${patientId}`);

const requestFetchReports = async (
  patientId: string,
  payload: { startDate: string; endDate: string }
): Promise<Report[]> =>
  get(`report/list/${patientId}`, {
    endDate: payload.endDate ? payload.endDate : format(new Date(), 'yyyy-MM-dd'),
    startDate: payload.startDate
      ? payload.startDate
      : format(subDays(new Date(), 15), 'yyyy-MM-dd'),
  });

const requestFetchReportEpisodesRange = async (
  ids: string
): Promise<Episode[]> => get(`report/episodes`, { ids });

const requestDeleteAccount = async ({ id, emailAddress }: { id: string, emailAddress: string }): Promise<{ email: string, userType: string }> =>
  remove(`session/${id}/${emailAddress}`);

const requestDeleteEpisode = async ({ id }: { id: string }): Promise<Episode> =>
  remove(`episode/${id}`);

const requestDeleteReport = async ({ id }: { id: string }): Promise<Report> =>
  remove(`report/${id}`);

export {
  requestGeneratePdfReport,
  requestCreateEpisode,
  requestFetchPatient,
  requestFetchEpisodes,
  requestUpdateEpisode,
  requestFetchReports,
  requestFetchReportEpisodesRange,
  requestCreateReport,
  requestDeleteAccount,
  requestDeleteEpisode,
  requestDeleteReport
};
