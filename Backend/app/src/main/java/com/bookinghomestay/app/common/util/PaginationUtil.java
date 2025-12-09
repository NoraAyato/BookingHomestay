package com.bookinghomestay.app.common.util;

import java.util.List;

/**
 * Utility class for pagination operations
 */
public class PaginationUtil {

    /**
     * Paginate a list based on page number (starting from 1) and page size
     * 
     * @param list     The full list to paginate
     * @param page     Page number (starting from 1)
     * @param pageSize Number of items per page
     * @return Sublist for the requested page
     */
    public static <T> List<T> paginate(List<T> list, int page, int pageSize) {
        if (list == null || list.isEmpty()) {
            return List.of();
        }

        int totalElements = list.size();
        int fromIndex = (page - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalElements);

        if (fromIndex >= totalElements || fromIndex < 0) {
            return List.of();
        }

        return list.subList(fromIndex, toIndex);
    }

    /**
     * Calculate total pages based on total elements and page size
     * 
     * @param totalElements Total number of elements
     * @param pageSize      Number of items per page
     * @return Total number of pages
     */
    public static int calculateTotalPages(int totalElements, int pageSize) {
        if (pageSize <= 0) {
            return 0;
        }
        return (int) Math.ceil((double) totalElements / pageSize);
    }

    /**
     * Check if a page number is valid
     * 
     * @param page          Page number (starting from 1)
     * @param totalElements Total number of elements
     * @param pageSize      Number of items per page
     * @return true if page is valid, false otherwise
     */
    public static boolean isValidPage(int page, int totalElements, int pageSize) {
        if (page < 1 || pageSize <= 0) {
            return false;
        }
        int totalPages = calculateTotalPages(totalElements, pageSize);
        return page <= totalPages;
    }
}
