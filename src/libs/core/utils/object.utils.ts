export class ObjectUtils {

  /**
   * Как Object.keys, только с нормальной типизацией
   * @param obj любой Object
   * @returns массив ключей объекта, где тип ключа - keyof T
   */
  public static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  /**
   * Проверяет, является ли переданный валью объектом
   * @param value любой значение
   * @returns true, если переданное значение - объект
   */
  public static isObject<T extends object>(value: unknown): value is T {
    return '[object Object]' === String(value);
  }

  /**
   * Проверяет, является ли переданное значение НЕ пустым объектом
   * @param value любое значение
   * @returns true, если переданное значение - НЕ пустой объект
   */
  public static isNonEmpty<T extends object>(value: unknown): value is T {
    return (
      ObjectUtils.isObject(value) &&
      ObjectUtils.keys(value).length > 0
    );
  }

}
