// ── Type shapes mirroring the Prisma schema from Phase 1 ──────────────────
// Swapping in the real API in Phase 4 is a pure data-source swap.

export interface MockOrganization {
  name:               string
  slug:               string
  type:               'club' | 'department'
  primaryColor:       string
  secondaryColor:     string
  description:        string
  showFacultyContact: boolean
  facultyContactEmail:string
  contactEmail?:      string
}

export interface MockEvent {
  id:          string
  title:       string
  description: string
  eventDate:   string   // ISO date string
  status:      'upcoming' | 'past'
  imageUrl?:   string
}

export interface MockAchievement {
  id:              string
  title:           string
  description:     string
  achievementDate: string
  imageUrl?:       string
}

// ── Data ──────────────────────────────────────────────────────────────────

export const mockOrganization: MockOrganization = {
  name:               'Robotics Club',
  slug:               'robotics',
  type:               'club',
  primaryColor:       '#E10600',
  secondaryColor:     '#141414',
  description:
    'The Robotics Club at MIT School of Engineering is a student-run community of builders, ' +
    'programmers, and problem-solvers. Founded in 2019, we design and build autonomous robots ' +
    'that compete at national and international competitions — from line-followers to full-scale ' +
    'combat bots. Every student, from first-year to final-year, is welcome. No experience required; ' +
    'just curiosity and a willingness to get your hands dirty.',
  showFacultyContact: true,
  facultyContactEmail:'prof.sharma@mit.edu',
  contactEmail:       'roboticsclub@mit.edu',
}

export const mockEvents: MockEvent[] = [
  {
    id:          'evt-001',
    title:       'Robo Rumble 2025 — Inter-College Combat Bot Championship',
    description:
      "Our flagship annual tournament returns. Twelve colleges, 24 combat robots, one winner. " +
      "This year we're hosting at the main college auditorium with an open audience. " +
      "Registration is free for spectators.",
    eventDate:   '2025-11-14T10:00:00.000Z',
    status:      'upcoming',
    imageUrl:    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80',
  },
  {
    id:          'evt-002',
    title:       'Line Follower Workshop for Freshers',
    description:
      "A hands-on Saturday session where first-year students build and program their first " +
      "line-following robot from scratch using Arduino and IR sensors. All components provided. " +
      "Limited to 30 seats \u2014 register through the club WhatsApp group.",
    eventDate:   '2025-10-04T09:30:00.000Z',
    status:      'upcoming',
    imageUrl:    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&q=80',
  },
  {
    id:          'evt-003',
    title:       'TechFest MIT 2025 — Robotics Showcase',
    description:
      "We presented five working prototypes at the college-wide TechFest, including our award-winning " +
      "pick-and-place arm and a swarm of three coordinated drones. Over 400 visitors interacted with our stall.",
    eventDate:   '2025-03-22T10:00:00.000Z',
    status:      'past',
    imageUrl:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',
  },
  {
    id:          'evt-004',
    title:       'Embedded Systems Bootcamp — 3-Day Intensive',
    description:
      "A deep-dive into real-time embedded programming covering FreeRTOS, motor drivers, PID control, " +
      "and sensor fusion. Led by our alumni mentor from Bosch. Participants left with a working IMU-stabilised platform.",
    eventDate:   '2025-01-17T09:00:00.000Z',
    status:      'past',
    imageUrl:    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=900&q=80',
  },
]

export const mockAchievements: MockAchievement[] = [
  {
    id:              'ach-001',
    title:           '1st Place — National Robotics Olympiad 2024, IIT Bombay',
    description:
      "Our team of four competed against 140 teams from across India in the autonomous navigation " +
      "challenge. Our robot completed the obstacle course 12 seconds faster than the nearest competitor, " +
      "earning us the gold trophy and \u20b950,000 prize money.",
    achievementDate: '2024-11-30',
    imageUrl:        'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=900&q=80',
  },
  {
    id:              'ach-002',
    title:           'Best Innovation Award — Smart India Hackathon 2024',
    description:
      "Robotics Club members Priya Menon and Aryan Desai won the Best Innovation Award at Smart India " +
      "Hackathon for their low-cost crop-monitoring drone prototype, which uses multispectral imaging to " +
      "detect nitrogen deficiency in wheat crops with 89% accuracy.",
    achievementDate: '2024-08-20',
    imageUrl:        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80',
  },
  {
    id:              'ach-003',
    title:           'Published in IEEE Xplore — Swarm Coordination Algorithm',
    description:
      "Our final-year project group published 'Decentralised Collision-Avoidance for Low-Cost UAV Swarms' " +
      "in the IEEE Xplore digital library following presentation at the International Conference on " +
      "Robotics and Automation Systems, Singapore.",
    achievementDate: '2024-05-10',
  },
]

// Derived stats for Home page
export const stats = [
  { value: 68,  label: 'Active members',     suffix: '' },
  { value: 24,  label: 'Events this year',   suffix: '' },
  { value: 6,   label: 'Years active',       suffix: '' },
  { value: 30,  label: 'Projects built',     suffix: '+' },
]
