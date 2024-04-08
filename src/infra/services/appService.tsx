import { get, patch, post } from '../api';
import { Episode, Patient } from '../@types/app.types';
import { format, subDays } from 'date-fns';

interface CreateReportDTO {
  startDate: string;
  endDate: string;
  patientId: string;
}

const requestCreateReport = async (
  payload: CreateReportDTO
): Promise<Episode> => post(`report`, payload);

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

const requestFetchReports = async (
  patientId: string,
  payload: { startDate: string; endDate: string }
): Promise<Episode[]> =>
  get(
    `report/list/${patientId}`,
    {},
    {
      enddate: payload.endDate
        ? payload.endDate
        : format(new Date(), 'yyyy-MM-dd'),
      startdate: payload.startDate
        ? payload.startDate
        : format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    }
  );

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
  requestCreateReport,
};
