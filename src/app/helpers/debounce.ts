const debounce = function (fn: Function, t: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), t);
  };
};

export default debounce;
