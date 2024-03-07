import { post } from '../api';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
  SignUpDTO,
  SignUpResponse,
} from '../@types/auth.types';

const requestHandleLogIn = async (payload: LogInDTO): Promise<LogInResponse> =>
  post('session/log-in', payload);

const requestHandleSingUp = async (
  payload: SignUpDTO
): Promise<SignUpResponse> => post('session/sign-up', payload);

const requestHandleCreatePatient = async (
  payload: PatientDTO
): Promise<PatientDTO> => post('patient', payload);

const requestHandleCreatePhysician = async (
  payload: PhysicianDTO
): Promise<PhysicianDTO> => post('physician', payload);

export {
  requestHandleLogIn,
  requestHandleSingUp,
  requestHandleCreatePatient,
  requestHandleCreatePhysician,
};
