import { post } from '../api';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
  SignUpDTO,
  SignUpResponse,
} from '../@types/auth.types';

const requestHandleLogIn = async (payload: LogInDTO): Promise<LogInResponse> => {
   const res= await post('session/log-in', payload);
   return {...res, email: payload.email}
}

const requestHandleSingUp = async (
  payload: SignUpDTO
): Promise<SignUpResponse> => post('session/sign-in', payload);

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
