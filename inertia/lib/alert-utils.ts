import Swal from 'sweetalert2';

export const showErrorAlert = (message?: string, title?: string) => {
    return Swal.fire({
        icon: 'error',
        title: title || 'Something went wrong!',
        text: message || 'We\'re sorry, but something unexpected happened. Please try again later.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
    });
};

export const showSuccessAlert = (message: string, title?: string) => {
  return Swal.fire({
    icon: 'success',
    title: title || 'Success!',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
};

export const showWarningAlert = (message: string, title?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: title || 'Warning!',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#d97706',
  });
};

export const showConfirmDialog = (message: string, title?: string) => {
  return Swal.fire({
    icon: 'question',
    title: title || 'Are you sure?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#059669',
    cancelButtonColor: '#dc2626',
  });
};

export default {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
  showConfirmDialog,
};
