export interface StudentStory {
  id: string;
  studentName: string;
  avatarText: string;
  university: string;
  course: string;
  quote: string;
  servicesUsed: string[];
  metricsSaved: string;
  verifiedStudent: boolean;
}

export const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'story-1',
    studentName: 'Aarav Sharma',
    avatarText: 'AS',
    university: 'Verified Campus Resident',
    course: 'B.Tech Computer Science, 3rd Year',
    quote: 'Before EaseHub, my weekends were lost haggling with local dhobis and searching for a decent mess that did not give me acid reflux. Now food and laundry arrive like clockwork, and my deposit was guaranteed when I moved PGs.',
    servicesUsed: ['Maa Ki Rasoi Food', 'SpinCraft Laundry', 'Zenith Living PG'],
    metricsSaved: 'Saved 14 hrs/week + ₹3,200/mo',
    verifiedStudent: true
  },
  {
    id: 'story-2',
    studentName: 'Sneha Sundaram',
    avatarText: 'SS',
    university: 'Verified Campus Resident',
    course: 'Biotechnology, 2nd Year',
    quote: 'Finding a single occupancy room with genuine 24/7 power backup and good Wi-Fi was impossible until I used the EaseHub curated list. Booked within 2 hours over WhatsApp.',
    servicesUsed: ['Zenith Living PG', 'QuickWash Express'],
    metricsSaved: 'Moved in 48 hrs without broker fee',
    verifiedStudent: true
  },
  {
    id: 'story-3',
    studentName: 'Rohan Deshmukh',
    avatarText: 'RD',
    university: 'Verified Campus Resident',
    course: 'Mechanical Engineering, 4th Year',
    quote: 'The Exam Crunch bundle was a lifesaver during placement semester. Midnight food slots meant I didn’t have to survive on instant noodles, and the express laundry turnaround was consistently on time.',
    servicesUsed: ['Exam Crunch Pack', 'High-Speed Wi-Fi', 'Gym Pass'],
    metricsSaved: '100% Exam Focus Kept',
    verifiedStudent: true
  }
];
