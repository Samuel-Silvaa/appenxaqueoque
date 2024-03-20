import { get, post } from '../api';
import { Episode, Patient } from '../@types/app.types';

const requestCreateEpisode = async (
  payload: Episode,
  patientId: string
): Promise<Episode> => post(`episode/${patientId}`, payload);

const requestFetchPatient = async (id: string): Promise<Patient> =>
  get(`patient/${id}`);

const requestFetchEpisodes = async (patientId: string): Promise<Episode[]> =>
  get(`episode/patient/${patientId}`);

export { requestCreateEpisode, requestFetchPatient, requestFetchEpisodes };
