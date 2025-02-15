import { DataSource, DataPage } from "../components/DataDropdown/DataDropdown"; // Импортируем DataPage для типизации возвращаемых данных
import { companies } from "./Companies";

type Company = {
  id: string;
  name: string;
};

// Функция для разбиения данных на страницы
const paginate = <T>(
  data: T[],
  pageSize: number,
  pageCursor: number
): DataPage<T> => {
  const start = pageCursor * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  return {
    prevPageCursor: pageCursor > 0 ? (pageCursor - 1).toString() : "",
    nextPageCursor:
      pageData.length === pageSize ? (pageCursor + 1).toString() : "",
    pageSize,
    data: pageData,
  };
};

// Реализуем ArraySource с пагинацией
export const ArraySource: DataSource<Company> = {
  // Функция для получения отображаемого имени компании
  getDisplayName: (value: Company) => value.name,

  // Функция для поиска по тексту
  startFulltextSearch: (text: string): Promise<DataPage<Company>> => {
    const filtered = companies.filter(
      (company) => company.name.toLowerCase().includes(text.toLowerCase()) // Фильтрация по имени компании
    );

    // Возвращаем первую страницу с результатами поиска
    return Promise.resolve(paginate(filtered, 10, 0)); // Разбиваем данные на страницы
  },

  // Функция для получения следующей страницы
  getNextPage: (pageCursor: string): Promise<DataPage<Company>> => {
    const cursor = parseInt(pageCursor, 10);
    const filtered = companies.filter(
      (company) => company.name.toLowerCase().includes("search") // Здесь можно добавлять логику поиска
    );

    // Возвращаем следующую страницу
    return Promise.resolve(paginate(filtered, 10, cursor));
  },

  // Функция для получения предыдущей страницы
  getPrevPage: (pageCursor: string): Promise<DataPage<Company>> => {
    const cursor = parseInt(pageCursor, 10);
    const filtered = companies.filter(
      (company) => company.name.toLowerCase().includes("search") // Добавить логику поиска
    );

    // Возвращаем предыдущую страницу
    return Promise.resolve(paginate(filtered, 10, cursor - 1));
  },
};

// import { DataSource, DataPage } from "../components/DataDropdown/DataDropdown"; // Импортируем DataPage для типизации возвращаемых данных
// import { companies } from "./Companies";

// type Company = {
//   id: string;
//   name: string;
// };

// // Реализуем ArraySource
// export const ArraySource: DataSource<Company> = {
//   // Функция для получения отображаемого имени компании
//   getDisplayName: (value: Company) => value.name,

//   // Функция для поиска по тексту
//   startFulltextSearch: (text: string): Promise<DataPage<Company>> => {
//     const filtered = companies.filter(
//       (company) => company.name.toLowerCase().includes(text.toLowerCase()) // Фильтрация по имени компании
//     );

//     // Возвращаем первую страницу с результатами поиска
//     return Promise.resolve({
//       prevPageCursor: "", // Здесь можно добавить логику для пагинации, если нужно
//       nextPageCursor: "", // То же самое для следующей страницы
//       pageSize: filtered.length, // Размер страницы
//       data: filtered, // Фильтрованные данные
//     });
//   },

//   // Функция для получения следующей страницы (пока не реализуем пагинацию)
//   getNextPage: (pageCursor: string): Promise<DataPage<Company>> => {
//     // Для простоты возвращаем первые 10 элементов
//     return Promise.resolve({
//       prevPageCursor: "",
//       nextPageCursor: "",
//       pageSize: 10,
//       data: companies.slice(0, 10),
//     });
//   },

//   // Функция для получения предыдущей страницы (не реализуем)
//   getPrevPage: (pageCursor: string): Promise<DataPage<Company>> => {
//     // Для простоты возвращаем первые 10 элементов
//     return Promise.resolve({
//       prevPageCursor: "",
//       nextPageCursor: "",
//       pageSize: 10,
//       data: companies.slice(0, 10),
//     });
//   },
// };
