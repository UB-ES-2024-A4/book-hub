export function getColorFromInitials(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}



// Utility function to format relative time
export const formatRelativeTime = (date: Date | string) => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffInSeconds < minute) {
    return 'Hace un momento';
  } else if (diffInSeconds < hour) {
    const mins = Math.floor(diffInSeconds / minute);
    return `Hace ${mins} min`;
  } else if (diffInSeconds < day) {
    const hrs = Math.floor(diffInSeconds / hour);
    return `Hace ${hrs} h`;
  } else if (diffInSeconds < day * 7) {
    const days = Math.floor(diffInSeconds / day);
    return `Hace ${days} d`;
  } else {
    // Fallback to a simple date format if more than a week old
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }
};