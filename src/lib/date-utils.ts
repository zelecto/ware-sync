/**
 * Formatea una fecha a formato local
 * @param date - Fecha en formato string, Date o timestamp
 * @returns Fecha formateada en formato local (dd/mm/yyyy)
 */
export function formatDate(date: string | Date | number): string {
  console.log("date", date);
  if (!date) return "-";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

/**
 * Formatea una fecha con hora
 * @param date - Fecha en formato string, Date o timestamp
 * @returns Fecha y hora formateada
 */
export function formatDateTime(date: string | Date | number): string {
  if (!date) return "-";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return dateObj.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

/**
 * Formatea solo la hora
 * @param date - Fecha en formato string, Date o timestamp
 * @returns Hora formateada
 */
export function formatTime(date: string | Date | number): string {
  if (!date) return "-";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return dateObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}
