import database from './database';

export const getAllDays = () => database.days.toArray()
export const getSingleDay = (day) => database.days.where('day').equalsIgnoreCase(day).toArray().then(
  (returnedDay) => {
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
export const editSingleDay = (updatedDay) => database.days.put(updatedDay);
