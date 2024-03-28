import { get, patch, post } from '../api';
import { Episode, Patient } from '../@types/app.types';

const requestCreateEpisode = async (
  payload: Episode,
  patientId: string
): Promise<Episode> => post(`episode/${patientId}`, payload);

const requestUpdateEpisode = async (
  payload: Episode,
  episodeId: string
): Promise<Episode> => {
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.email;
  delete payload.height;
  delete payload.kinship;
  delete payload.name;
  delete payload.patientId;
  delete payload.weight;
  return patch(`episode/${episodeId}`, payload);
};

const requestFetchPatient = async (id: string): Promise<Patient> =>
  get(`patient/${id}`);

const requestFetchEpisodes = async (patientId: string): Promise<Episode[]> =>
  get(`episode/patient/${patientId}`);

const requestFetchReports = async (patientId: string): Promise<Episode[]> =>
  get(`report/list/${patientId}`);

const requestFetchReportEpisodesRange = async (
  ids: string
): Promise<Episode[]> => get(`report/episodes`, {}, { ids: ids });

export {
  requestCreateEpisode,
  requestFetchPatient,
  requestFetchEpisodes,
  requestUpdateEpisode,
  requestFetchReports,
  requestFetchReportEpisodesRange,
};
