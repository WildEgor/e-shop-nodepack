export class UniqueUtils {

  /**
   * @description Создает массив уникальных значений по функции
   * @param values
   * @param element
   */
  public static uniqueArray<TData, TElement = string>(
    values: TData[] | undefined,
    element: (value: TData) => TElement,
  ): NonNullable<TElement>[] {
    const uniqueElements = new Set<NonNullable<TElement>>();

    if (values) {
      for (const value of values) {
        const field = element(value);
        if (field) {
          uniqueElements.add(field);
        }
      }
    }

    return Array.from(uniqueElements);
  }

  /**
   * @description Создает Map уникальных значений по функции
   * @param values
   * @param element
   */
  public static uniqueDict<TData, TKey = string>(
    values: TData[] | undefined,
    element: (value: TData) => TKey,
  ): Map<TKey, TData> {
    const uniqueElements = new Map<TKey, TData>();

    if (values?.length) {
      for (const value of values) {
        const key = element(value);
        uniqueElements.set(key, value);
      }
    }

    return uniqueElements;
  }

  /**
   * @description Создает Set с уникальными значениями. Рекомендуется использовать вместо прямого заполнения Set чтобы избегать деструктуризации (использования spread оператора).
   * @param initialValues любой итерабельный объект (массив) или undefined. undefined в сет НЕ попадет!
   * @param values любое кол-во значений TData, которые будут добавлены в сет
   * @returns Set с уникальными значениями
   */
  public static uniqueFields<TData>(initialValues?: Iterable<TData>, ...values: TData[]): Set<TData> {
    const uniqueElements = new Set<TData>(initialValues);
    for (const value of values) {
      uniqueElements.add(value);
    }
    return uniqueElements;
  }

  /**
   * @description Группирует по ключу в Map
   * @param values
   * @param element
   */
  public static groupBy<TData, TKey = string | number>(
    values: TData[] | undefined,
    element: (value: TData) => TKey,
  ): Map<TKey, TData[]> {
    const groups = new Map<TKey, TData[]>();

    if (values?.length) {
      for (const value of values) {
        const key = element(value);
        const prev = groups.get(key) ?? [];

        prev[prev.length] = value;
        groups.set(key, prev);
      }
    }

    return groups;
  }

}
