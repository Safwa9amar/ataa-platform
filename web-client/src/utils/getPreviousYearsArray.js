function getPreviousYearsArray() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
  
    for (let i = 0; i < 10; i++) {
      yearsArray.push(currentYear - i);
    }
    
    return yearsArray.slice(1);
  }
  

export default getPreviousYearsArray;