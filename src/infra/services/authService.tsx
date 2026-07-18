import { post, put, patch } from '../api';
import {
  LogInDTO,
  LogInResponse,
  PatientDTO,
  PhysicianDTO,
  SignUpDTO,
  SignUpResponse,
  SendEmailConfirmationDTO,
  SendEmailConfirmationResponse,
  ConfirmEmailDTO,
  ConfirmEmailResponse,
  SendNewPasswordWithCode,
  SendNewPassword,
} from '../@types/auth.types';

const requestHandleLogIn = async (payload: LogInDTO): Promise<LogInResponse> =>
  post('session/log-in', payload);

const requestHandleSingUp = async (
  payload: SignUpDTO
): Promise<SignUpResponse> => post('session/sign-in', payload);

const requestHandleCreatePatient = async (
  payload: PatientDTO
): Promise<PatientDTO> => post('patient', payload);

const requestHandleCreatePhysician = async (
  payload: PhysicianDTO
): Promise<PhysicianDTO> => post('physician', payload);

const requestHandleSendEmailConfirmation = async (
  payload: SendEmailConfirmationDTO
): Promise<SendEmailConfirmationResponse> =>
  post('session/send-email-confirmation', payload);

const requestHandleSendPasswordEmailConfirmation = async (
  payload: SendEmailConfirmationDTO
): Promise<SendEmailConfirmationResponse> =>
  post('session/password-reset/request', payload);

const requestHandleSendNewPasswordWithCode = async (
  payload: SendNewPasswordWithCode
): Promise<{ message: string }> =>
  post('session/password-reset/confirm', payload);

const requestHandleResetPassword = async (
  payload: SendNewPassword
): Promise<{ message: string }> => post('session/change-password', payload);

const requestHandleConfirmEmail = async (
  payload: ConfirmEmailDTO
): Promise<ConfirmEmailResponse> => post('session/confirm-email', payload);

const requestUpdateAvatar = async (payload: {
  avatar: string;
  email?: string;
}): Promise<any> => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: payload.avatar,
    name: 'avatar' + new Date().getTime().toString() + '.jpg',
    type: 'image/jpeg',
  } as any);

  return put('session/avatar', formData, {
    'Content-Type': 'multipart/form-data',
  });
};

const requestUpdatePatient = async (
  payload: PatientDTO & { id: string }
): Promise<PatientDTO> => {
  const { id, ...body } = payload;
  return patch(`patient/${payload.id}`, body);
};

export {
  requestHandleLogIn,
  requestHandleSingUp,
  requestHandleCreatePatient,
  requestHandleCreatePhysician,
  requestHandleSendEmailConfirmation,
  requestHandleConfirmEmail,
  requestUpdateAvatar,
  requestUpdatePatient,
  requestHandleSendPasswordEmailConfirmation,
  requestHandleSendNewPasswordWithCode,
  requestHandleResetPassword,
};
