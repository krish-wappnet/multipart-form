export const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  export const checkOverlappingDates = (experiences: { startDate: string; endDate?: string; currentlyWorking: boolean }[]): boolean => {
    for (let i = 0; i < experiences.length; i++) {
      for (let j = i + 1; j < experiences.length; j++) {
        const exp1 = experiences[i];
        const exp2 = experiences[j];
        const start1 = new Date(exp1.startDate);
        const end1 = exp1.currentlyWorking ? new Date() : exp1.endDate ? new Date(exp1.endDate) : new Date();
        const start2 = new Date(exp2.startDate);
        const end2 = exp2.currentlyWorking ? new Date() : exp2.endDate ? new Date(exp2.endDate) : new Date();
  
        if (start1 <= end2 && start2 <= end1) {
          return true; // Overlap detected
        }
      }
    }
    return false;
  };
  
  export const calculateTotalExperience = (experiences: { startDate: string; endDate?: string; currentlyWorking: boolean }[]): number => {
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.currentlyWorking ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
      totalMonths += months;
    });
    return Math.round(totalMonths / 12);
  };