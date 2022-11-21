const greetings = (): string => {
  const date = new Date();
  const hours = date.getHours();
  const message =
    hours < 12
      ? 'Good Morning'
      : hours < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  return message;
};

export default greetings;
