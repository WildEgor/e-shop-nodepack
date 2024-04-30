export class ArrayUtils {

  /**
   * Проверяет, является ли переданное значение НЕ пустым массивом
   * @param value любое значение
   * @returns true если значение массив и не пустой, иначе false
   */
  public static isNonEmptyArray<T>(value: unknown): value is T[] {
    return Array.isArray(value) && value.length > 0;
  }

}
