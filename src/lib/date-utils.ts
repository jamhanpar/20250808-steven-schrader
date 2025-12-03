/**
 * Utility functions for date formatting
 */

/**
 * Format a date string to "Mon DD, YYYY" format
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string like "Dec 01, 2025"
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "";

  try {
    // Parse the date as local time to avoid timezone offset issues
    // For ISO dates like "2025-12-01", split and create date in local timezone
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`);
        return dateString;
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } else {
      // Fallback for non-ISO date strings
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`);
        return dateString;
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
  } catch (error) {
    console.warn(`Error formatting date: ${dateString}`, error);
    return dateString; // Return original string if error
  }
}

/**
 * Format a date string to "Mon DD, YYYY" format with custom options
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export function formatDateCustom(
  dateString: string | null,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateString) return "";

  try {
    let date: Date;

    // Parse the date as local time to avoid timezone offset issues
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      date = new Date(year, month, day);
    } else {
      // Fallback for non-ISO date strings
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return dateString;
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      year: "numeric",
    };

    return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
  } catch (error) {
    console.warn(`Error formatting date: ${dateString}`, error);
    return dateString;
  }
}

/**
 * Extract year from date string
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Year as string
 */
export function getYearFromDate(dateString: string | null): string {
  if (!dateString) return "";

  try {
    // For ISO dates like "2025-12-01", we can extract year directly
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return parts[0];
    } else {
      // Fallback for non-ISO date strings
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`);
        return dateString;
      }
      return date.getFullYear().toString();
    }
  } catch (error) {
    console.warn(`Error extracting year from date: ${dateString}`, error);
    return dateString;
  }
}
