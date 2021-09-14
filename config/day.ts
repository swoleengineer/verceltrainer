import database from './database';

export const getAllDays = () => (database as any).days.toArray()
export const getSingleDay = (day: string) => (database as any).days.where('day').equalsIgnoreCase(day).toArray().then(
  (returnedDay: any) => {
    if (!returnedDay[0]) {
      const newDay = {
        day,
        title: ''
      };
      return newDay;
    }
    return returnedDay;
  }
);
export const editSingleDay = (updatedDay: { [key: string]: any}) => (database as any).days.put(updatedDay);
