export default interface ChangePasswordI {
  currentPassword: {
    value: string;
    showPassword: boolean;
  };
  newPassword: {
    value: string;
    showPassword: boolean;
  };
  confirmPassword: {
    value: string;
    showPassword: boolean;
  };
}
