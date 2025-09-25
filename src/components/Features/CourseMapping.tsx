import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { badgeService } from '../../services/badgeService';
import BadgeNotification from '../UI/BadgeNotification';

// Type definitions
interface CareerDetails {
  courses: string[];
  scope: string;
  duration: string;
  avgSalary: string;
}

interface CareerNode {
  id: string;
  label: string;
  color: string;
  details?: CareerDetails;
  children?: Record<string, CareerNode>;
}

interface CareerData {
  [key: string]: CareerNode;
}

// Career data structure
const careerData: CareerData = {
  Science: {
    id: 'science',
    label: 'Science',
    color: '#3B82F6',
    children: {
      Engineering: {
        id: 'engineering',
        label: 'Engineering',
        color: '#8B5CF6',
        children: {
          'Computer Science': {
            id: 'cs',
            label: 'Computer Science',
            color: '#10B981',
            children: {
              'Software Developer': {
                id: 'software-dev',
                label: 'Software Developer',
                color: '#059669',
                children: {
                  'Frontend Developer': {
                    id: 'frontend-dev',
                    label: 'Frontend Developer',
                    color: '#16A34A',
                    details: {
                      courses: ['React.js', 'Angular', 'Vue.js', 'HTML/CSS/JavaScript'],
                      scope: 'UI Developer, React Developer, JavaScript Developer',
                      duration: '6 months - 2 years',
                      avgSalary: '₹3-15 LPA'
                    }
                  },
                  'Backend Developer': {
                    id: 'backend-dev',
                    label: 'Backend Developer',
                    color: '#0891B2',
                    details: {
                      courses: ['Node.js', 'Python', 'Java', 'Database Management'],
                      scope: 'API Developer, Server-side Developer, Database Developer',
                      duration: '6 months - 2 years',
                      avgSalary: '₹4-18 LPA'
                    }
                  },
                  'Mobile App Developer': {
                    id: 'mobile-dev',
                    label: 'Mobile App Developer',
                    color: '#7C3AED',
                    details: {
                      courses: ['Flutter', 'React Native', 'Android', 'iOS'],
                      scope: 'Android Developer, iOS Developer, Cross-platform Developer',
                      duration: '6 months - 2 years',
                      avgSalary: '₹4-20 LPA'
                    }
                  },
                  'Full Stack Developer': {
                    id: 'fullstack-dev',
                    label: 'Full Stack Developer',
                    color: '#DC2626',
                    details: {
                      courses: ['MERN Stack', 'MEAN Stack', 'Django', 'Laravel'],
                      scope: 'Full Stack Engineer, Web Application Developer',
                      duration: '1-3 years',
                      avgSalary: '₹6-25 LPA'
                    }
                  }
                }
              },
              'Data Scientist / Data Engineer': {
                id: 'data-science',
                label: 'Data Scientist / Data Engineer',
                color: '#7C3AED',
                children: {
                  'Data Scientist': {
                    id: 'data-scientist',
                    label: 'Data Scientist',
                    color: '#8B5CF6',
                    details: {
                      courses: ['Python', 'R', 'Machine Learning', 'Statistics'],
                      scope: 'ML Engineer, Data Analyst, Research Scientist',
                      duration: '1-2 years',
                      avgSalary: '₹8-30 LPA'
                    }
                  },
                  'Data Engineer': {
                    id: 'data-engineer',
                    label: 'Data Engineer',
                    color: '#6366F1',
                    details: {
                      courses: ['Apache Spark', 'Hadoop', 'SQL', 'ETL Tools'],
                      scope: 'Big Data Engineer, Pipeline Developer, Data Architect',
                      duration: '1-2 years',
                      avgSalary: '₹7-25 LPA'
                    }
                  },
                  'Business Intelligence Analyst': {
                    id: 'bi-analyst',
                    label: 'BI Analyst',
                    color: '#EC4899',
                    details: {
                      courses: ['Tableau', 'Power BI', 'SQL', 'Data Visualization'],
                      scope: 'Data Analyst, Business Analyst, Reporting Specialist',
                      duration: '6 months - 1 year',
                      avgSalary: '₹5-18 LPA'
                    }
                  },
                  'AI/ML Engineer': {
                    id: 'ai-ml-engineer',
                    label: 'AI/ML Engineer',
                    color: '#F59E0B',
                    details: {
                      courses: ['TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
                      scope: 'AI Developer, ML Engineer, Deep Learning Specialist',
                      duration: '1-3 years',
                      avgSalary: '₹10-40 LPA'
                    }
                  }
                }
              },
              'Cybersecurity Analyst / Ethical Hacker': {
                id: 'cybersecurity',
                label: 'Cybersecurity Analyst',
                color: '#DC2626',
                children: {
                  'Ethical Hacker': {
                    id: 'ethical-hacker',
                    label: 'Ethical Hacker',
                    color: '#B91C1C',
                    details: {
                      courses: ['CEH', 'OSCP', 'Penetration Testing', 'Kali Linux'],
                      scope: 'Penetration Tester, Security Researcher, Bug Bounty Hunter',
                      duration: '1-2 years',
                      avgSalary: '₹8-35 LPA'
                    }
                  },
                  'Security Analyst': {
                    id: 'security-analyst',
                    label: 'Security Analyst',
                    color: '#EF4444',
                    details: {
                      courses: ['CompTIA Security+', 'CISSP', 'Security Operations'],
                      scope: 'SOC Analyst, Security Specialist, Incident Response',
                      duration: '6 months - 1 year',
                      avgSalary: '₹5-20 LPA'
                    }
                  },
                  'Cybersecurity Consultant': {
                    id: 'security-consultant',
                    label: 'Security Consultant',
                    color: '#7C2D12',
                    details: {
                      courses: ['Risk Assessment', 'Compliance', 'Security Frameworks'],
                      scope: 'Security Advisor, Risk Analyst, Compliance Officer',
                      duration: '2-3 years',
                      avgSalary: '₹10-30 LPA'
                    }
                  },
                  'Forensic Analyst': {
                    id: 'forensic-analyst',
                    label: 'Forensic Analyst',
                    color: '#991B1B',
                    details: {
                      courses: ['Digital Forensics', 'Incident Investigation', 'Evidence Analysis'],
                      scope: 'Digital Forensics Expert, Cyber Crime Investigator',
                      duration: '1-2 years',
                      avgSalary: '₹6-25 LPA'
                    }
                  }
                }
              },
              'Cloud Computing & DevOps Engineer': {
                id: 'cloud-devops',
                label: 'Cloud Computing & DevOps',
                color: '#0EA5E9',
                children: {
                  'Cloud Architect': {
                    id: 'cloud-architect',
                    label: 'Cloud Architect',
                    color: '#0284C7',
                    details: {
                      courses: ['AWS Solutions Architect', 'Azure Architect', 'Cloud Design'],
                      scope: 'Solution Architect, Cloud Consultant, Infrastructure Designer',
                      duration: '2-3 years',
                      avgSalary: '₹15-45 LPA'
                    }
                  },
                  'DevOps Engineer': {
                    id: 'devops-engineer',
                    label: 'DevOps Engineer',
                    color: '#0891B2',
                    details: {
                      courses: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
                      scope: 'CI/CD Engineer, Infrastructure Engineer, Automation Engineer',
                      duration: '1-2 years',
                      avgSalary: '₹8-25 LPA'
                    }
                  },
                  'Site Reliability Engineer': {
                    id: 'sre',
                    label: 'SRE',
                    color: '#0369A1',
                    details: {
                      courses: ['Monitoring', 'Incident Management', 'System Design'],
                      scope: 'Platform Engineer, Production Engineer, System Engineer',
                      duration: '1-3 years',
                      avgSalary: '₹10-30 LPA'
                    }
                  },
                  'Cloud Security Engineer': {
                    id: 'cloud-security',
                    label: 'Cloud Security Engineer',
                    color: '#1E40AF',
                    details: {
                      courses: ['Cloud Security', 'IAM', 'Compliance', 'Zero Trust'],
                      scope: 'Security Engineer, Compliance Specialist, Cloud Security Architect',
                      duration: '2-3 years',
                      avgSalary: '₹12-35 LPA'
                    }
                  }
                }
              },
              'Research & Higher Studies': {
                id: 'cs-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                children: {
                  'AI Research': {
                    id: 'ai-research',
                    label: 'AI Research',
                    color: '#7C3AED',
                    details: {
                      courses: ['M.Tech AI', 'PhD AI', 'Research Publications'],
                      scope: 'AI Researcher, Research Scientist, Academic Professor',
                      duration: '5-8 years',
                      avgSalary: '₹12-50 LPA'
                    }
                  },
                  'Robotics Research': {
                    id: 'robotics-research',
                    label: 'Robotics Research',
                    color: '#6366F1',
                    details: {
                      courses: ['M.Tech Robotics', 'PhD Robotics', 'ROS Programming'],
                      scope: 'Robotics Engineer, Research Developer, Automation Researcher',
                      duration: '5-7 years',
                      avgSalary: '₹10-35 LPA'
                    }
                  },
                  'Quantum Computing': {
                    id: 'quantum-computing',
                    label: 'Quantum Computing',
                    color: '#A855F7',
                    details: {
                      courses: ['Quantum Physics', 'Quantum Algorithms', 'PhD Quantum'],
                      scope: 'Quantum Researcher, Quantum Software Engineer, Research Scientist',
                      duration: '6-10 years',
                      avgSalary: '₹15-60 LPA'
                    }
                  },
                  'Academic Professor': {
                    id: 'academic-professor',
                    label: 'Academic Professor',
                    color: '#9333EA',
                    details: {
                      courses: ['PhD', 'Post-Doc', 'Teaching Experience'],
                      scope: 'University Professor, Research Guide, Department Head',
                      duration: '8-12 years',
                      avgSalary: '₹8-40 LPA'
                    }
                  }
                }
              }
            }
          },
          'Mechanical': {
            id: 'mechanical',
            label: 'Mechanical',
            color: '#F59E0B',
            children: {
              'Automobile Engineer': {
                id: 'automobile-eng',
                label: 'Automobile Engineer',
                color: '#DC2626',
                details: {
                  courses: ['B.Tech Mechanical', 'M.Tech Automotive', 'Electric Vehicle Engineering'],
                  scope: 'EV Engineer, Automotive Design Engineer, Vehicle Testing Engineer, R&D Engineer in Auto Industry',
                  duration: '4-5 years',
                  avgSalary: '₹4-20 LPA'
                }
              },
              'Robotics & Automation Specialist': {
                id: 'robotics-auto',
                label: 'Robotics & Automation',
                color: '#7C3AED',
                details: {
                  courses: ['B.Tech Mechanical', 'M.Tech Robotics', 'Automation Engineering'],
                  scope: 'Robotics Engineer, Automation Specialist, Mechatronics Engineer, Industrial Automation Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹5-22 LPA'
                }
              },
              'HVAC & Thermal Systems Engineer': {
                id: 'hvac-thermal',
                label: 'HVAC & Thermal Systems',
                color: '#EF4444',
                details: {
                  courses: ['B.Tech Mechanical', 'M.Tech Thermal', 'HVAC Design Certification'],
                  scope: 'HVAC Engineer, Thermal Engineer, Refrigeration Engineer, Energy Systems Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-16 LPA'
                }
              },
              'Manufacturing & Production Engineer': {
                id: 'manufacturing-prod',
                label: 'Manufacturing & Production',
                color: '#059669',
                details: {
                  courses: ['B.Tech Mechanical', 'Production Engineering', 'Industrial Engineering'],
                  scope: 'Production Engineer, Manufacturing Engineer, Process Engineer, Quality Engineer, Plant Manager',
                  duration: '4 years',
                  avgSalary: '₹3-15 LPA'
                }
              },
              'Research & Higher Studies': {
                id: 'mech-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                details: {
                  courses: ['M.Tech Design', 'M.Tech CAD/CAM', 'M.Tech Renewable Energy', 'PhD Programs'],
                  scope: 'Design Researcher, CAD/CAM Specialist, Renewable Energy Researcher, Academic Professor, R&D Engineer',
                  duration: '5-8 years',
                  avgSalary: '₹6-25 LPA'
                }
              }
            }
          },
          'Civil': {
            id: 'civil',
            label: 'Civil',
            color: '#EF4444',
            children: {
              'Structural Engineer': {
                id: 'structural-eng',
                label: 'Structural Engineer',
                color: '#7C2D12',
                details: {
                  courses: ['B.Tech Civil', 'M.Tech Structural', 'Structural Design Certification'],
                  scope: 'Structural Engineer, Bridge Engineer, Building Designer, Dam Engineer, Earthquake Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-18 LPA'
                }
              },
              'Transportation Engineer': {
                id: 'transportation-eng',
                label: 'Transportation Engineer',
                color: '#059669',
                details: {
                  courses: ['B.Tech Civil', 'M.Tech Transportation', 'Smart Cities Engineering'],
                  scope: 'Highway Engineer, Railway Engineer, Traffic Engineer, Smart Cities Planner, Airport Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-16 LPA'
                }
              },
              'Environmental Engineer': {
                id: 'environmental-eng',
                label: 'Environmental Engineer',
                color: '#16A34A',
                details: {
                  courses: ['B.Tech Civil', 'M.Tech Environmental', 'Water Management', 'Sustainability Engineering'],
                  scope: 'Water Engineer, Waste Management Engineer, Environmental Consultant, Sustainability Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-15 LPA'
                }
              },
              'Construction Project Manager': {
                id: 'construction-pm',
                label: 'Construction Project Manager',
                color: '#DC2626',
                details: {
                  courses: ['B.Tech Civil', 'Construction Management', 'PMP Certification'],
                  scope: 'Project Manager, Site Engineer, Construction Manager, Quantity Surveyor, Contract Manager',
                  duration: '4-6 years',
                  avgSalary: '₹5-20 LPA'
                }
              },
              'Research & Higher Studies': {
                id: 'civil-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                details: {
                  courses: ['M.Tech Earthquake Engineering', 'M.Tech Urban Planning', 'PhD Civil Engineering'],
                  scope: 'Earthquake Engineering Researcher, Urban Planning Specialist, Academic Professor, R&D Engineer',
                  duration: '5-8 years',
                  avgSalary: '₹6-25 LPA'
                }
              }
            }
          },
          'Electrical': {
            id: 'electrical',
            label: 'Electrical',
            color: '#0EA5E9',
            children: {
              'Power Systems Engineer': {
                id: 'power-systems-eng',
                label: 'Power Systems Engineer',
                color: '#1D4ED8',
                details: {
                  courses: ['B.Tech Electrical', 'M.Tech Power Systems', 'Smart Grid Technology'],
                  scope: 'Power Engineer, Smart Grid Engineer, Electrical Design Engineer, Protection Engineer, Energy Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-18 LPA'
                }
              },
              'Electronics & Embedded Systems Engineer': {
                id: 'electronics-embedded',
                label: 'Electronics & Embedded Systems',
                color: '#7C3AED',
                details: {
                  courses: ['B.Tech ECE/EEE', 'Embedded Systems', 'VLSI Design', 'IoT Development'],
                  scope: 'Electronics Engineer, Embedded Engineer, VLSI Engineer, IoT Developer, Hardware Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-20 LPA'
                }
              },
              'Renewable Energy Engineer': {
                id: 'renewable-energy-eng',
                label: 'Renewable Energy Engineer',
                color: '#16A34A',
                details: {
                  courses: ['B.Tech Electrical', 'M.Tech Renewable Energy', 'Solar/Wind/Hydro Engineering'],
                  scope: 'Solar Engineer, Wind Energy Engineer, Hydro Engineer, Energy Analyst, Green Energy Consultant',
                  duration: '4-5 years',
                  avgSalary: '₹5-20 LPA'
                }
              },
              'Control Systems & Instrumentation Engineer': {
                id: 'control-instrumentation',
                label: 'Control Systems & Instrumentation',
                color: '#059669',
                details: {
                  courses: ['B.Tech Electrical', 'M.Tech Control Systems', 'Instrumentation Engineering'],
                  scope: 'Control Engineer, Instrumentation Engineer, Automation Engineer, Process Control Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-16 LPA'
                }
              },
              'Research & Higher Studies': {
                id: 'electrical-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                details: {
                  courses: ['M.Tech AI in Electrical', 'M.Tech Microelectronics', 'PhD Electrical Engineering'],
                  scope: 'AI in Electrical Systems Researcher, Microelectronics Specialist, Academic Professor, R&D Engineer',
                  duration: '5-8 years',
                  avgSalary: '₹6-28 LPA'
                }
              }
            }
          },
          'Aerospace': {
            id: 'aerospace',
            label: 'Aerospace',
            color: '#7C3AED',
            children: {
              'Aerodynamics Engineer': {
                id: 'aerodynamics-eng',
                label: 'Aerodynamics Engineer',
                color: '#8B5CF6',
                details: {
                  courses: ['B.Tech Aerospace', 'M.Tech Aerodynamics', 'Fluid Mechanics Specialization'],
                  scope: 'Aerodynamics Engineer, Wind Tunnel Engineer, Flight Performance Analyst, CFD Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹5-22 LPA'
                }
              },
              'Aircraft Design & Maintenance Engineer': {
                id: 'aircraft-design-maintenance',
                label: 'Aircraft Design & Maintenance',
                color: '#1E40AF',
                details: {
                  courses: ['B.Tech Aerospace', 'Aircraft Maintenance Engineering', 'Aircraft Design'],
                  scope: 'Aircraft Design Engineer, Maintenance Engineer, Flight Test Engineer, Certification Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹5-20 LPA'
                }
              },
              'Space Technology Specialist': {
                id: 'space-tech-specialist',
                label: 'Space Technology Specialist',
                color: '#059669',
                details: {
                  courses: ['B.Tech Aerospace', 'M.Tech Space Technology', 'Satellite Engineering'],
                  scope: 'ISRO Scientist, DRDO Engineer, Satellite Engineer, Mission Control Engineer, Space Systems Engineer',
                  duration: '4-6 years',
                  avgSalary: '₹6-30 LPA'
                }
              },
              'Avionics Systems Engineer': {
                id: 'avionics-systems',
                label: 'Avionics Systems Engineer',
                color: '#DC2626',
                details: {
                  courses: ['B.Tech Aerospace', 'Avionics Engineering', 'Flight Control Systems'],
                  scope: 'Avionics Engineer, Flight Systems Engineer, Navigation Systems Engineer, Aircraft Electronics Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹5-20 LPA'
                }
              },
              'Research & Higher Studies': {
                id: 'aerospace-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                details: {
                  courses: ['M.Tech/PhD Space Science', 'M.Tech Propulsion', 'PhD Aerospace Engineering'],
                  scope: 'Space Science Researcher, Propulsion Researcher, Academic Professor, ISRO/DRDO Scientist',
                  duration: '5-8 years',
                  avgSalary: '₹8-35 LPA'
                }
              }
            }
          },
          'Chemical': {
            id: 'chemical',
            label: 'Chemical',
            color: '#DC2626',
            children: {
              'Process Engineer': {
                id: 'process-engineer',
                label: 'Process Engineer',
                color: '#BE123C',
                details: {
                  courses: ['B.Tech Chemical', 'M.Tech Process Engineering', 'Petrochemicals Engineering'],
                  scope: 'Process Engineer, Petrochemical Engineer, Refinery Engineer, Fertilizer Engineer, Plant Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹5-22 LPA'
                }
              },
              'Biochemical Engineer': {
                id: 'biochemical-engineer',
                label: 'Biochemical Engineer',
                color: '#059669',
                details: {
                  courses: ['B.Tech Chemical', 'M.Tech Biotechnology', 'Pharmaceutical Engineering'],
                  scope: 'Pharmaceutical Engineer, Biotech Engineer, Drug Manufacturing Engineer, Bioprocess Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-18 LPA'
                }
              },
              'Environmental & Pollution Control Engineer': {
                id: 'environmental-pollution',
                label: 'Environmental & Pollution Control',
                color: '#16A34A',
                details: {
                  courses: ['B.Tech Chemical', 'M.Tech Environmental', 'Pollution Control Engineering'],
                  scope: 'Environmental Engineer, Pollution Control Engineer, Waste Treatment Engineer, Sustainability Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-16 LPA'
                }
              },
              'Food & Materials Engineer': {
                id: 'food-materials',
                label: 'Food & Materials Engineer',
                color: '#F59E0B',
                details: {
                  courses: ['B.Tech Chemical', 'Food Technology', 'Materials Science Engineering'],
                  scope: 'Food Process Engineer, Materials Engineer, Quality Control Engineer, Product Development Engineer',
                  duration: '4-5 years',
                  avgSalary: '₹4-16 LPA'
                }
              },
              'Research & Higher Studies': {
                id: 'chemical-research',
                label: 'Research & Higher Studies',
                color: '#8B5CF6',
                details: {
                  courses: ['M.Tech Nanotechnology', 'M.Tech Advanced Materials', 'PhD Chemical Engineering'],
                  scope: 'Nanotechnology Researcher, Advanced Materials Scientist, Energy Systems Researcher, Academic Professor',
                  duration: '5-8 years',
                  avgSalary: '₹6-30 LPA'
                }
              }
            }
          }
        }
      },
      Medicine: {
        id: 'medicine',
        label: 'Medicine & Healthcare',
        color: '#EC4899',
        children: {
          'Medical Doctor': {
            id: 'mbbs',
            label: 'Medical Doctor',
            color: '#DC2626',
            details: {
              courses: ['MBBS', 'MD/MS Specialization'],
              scope: 'General Physician, Specialist Doctor, Surgeon, Cardiologist, Neurologist, Orthopedist',
              duration: '5.5-8 years',
              avgSalary: '₹8-50 LPA'
            }
          },
          'Dentistry': {
            id: 'dentistry',
            label: 'Dentistry',
            color: '#059669',
            details: {
              courses: ['BDS', 'MDS'],
              scope: 'General Dentist, Orthodontist, Oral Surgeon, Endodontist',
              duration: '5-6 years',
              avgSalary: '₹4-20 LPA'
            }
          },
          'Pharmacy': {
            id: 'pharmacy',
            label: 'Pharmacy',
            color: '#0891B2',
            details: {
              courses: ['B.Pharm', 'D.Pharm', 'M.Pharm'],
              scope: 'Clinical Pharmacist, Industrial Pharmacist, Research Pharmacist, Drug Inspector, Regulatory Affairs',
              duration: '2-4 years',
              avgSalary: '₹3-12 LPA'
            }
          },
          'Nursing': {
            id: 'nursing',
            label: 'Nursing',
            color: '#7C2D12',
            details: {
              courses: ['GNM', 'B.Sc Nursing', 'M.Sc Nursing'],
              scope: 'Registered Nurse, Critical Care Nurse, Pediatric Nurse, Psychiatric Nurse',
              duration: '3-4 years',
              avgSalary: '₹2.5-8 LPA'
            }
          },
          'Allied Health': {
            id: 'allied-health',
            label: 'Allied Health',
            color: '#BE123C',
            details: {
              courses: ['BPT', 'BOT', 'B.Sc Medical Lab Technology', 'B.Sc Radiology'],
              scope: 'Physiotherapist, Occupational Therapist, Medical Lab Technologist, Radiology Technician',
              duration: '3-4 years',
              avgSalary: '₹2.5-10 LPA'
            }
          }
        }
      },
      'Pure Sciences': {
        id: 'pure-sciences',
        label: 'Pure Sciences',
        color: '#16A34A',
        children: {
          'Physics': {
            id: 'physics',
            label: 'Physics',
            color: '#1D4ED8',
            details: {
              courses: ['B.Sc Physics', 'M.Sc Physics', 'PhD Physics'],
              scope: 'Research Scientist, Nuclear Physicist, Quantum Computing Researcher, ISRO Scientist',
              duration: '3-6 years',
              avgSalary: '₹3-15 LPA'
            }
          },
          'Chemistry': {
            id: 'chemistry',
            label: 'Chemistry',
            color: '#059669',
            details: {
              courses: ['B.Sc Chemistry', 'M.Sc Chemistry', 'PhD Chemistry'],
              scope: 'Research Scientist, Quality Control Analyst, Pharmaceutical Researcher, Forensic Expert',
              duration: '3-6 years',
              avgSalary: '₹3-12 LPA'
            }
          },
          'Biology': {
            id: 'biology',
            label: 'Biology',
            color: '#16A34A',
            details: {
              courses: ['B.Sc Biology', 'M.Sc Biotechnology', 'PhD Life Sciences'],
              scope: 'Research Scientist, Biotechnologist, Marine Biologist, Wildlife Biologist, Environmental Scientist',
              duration: '3-6 years',
              avgSalary: '₹3-15 LPA'
            }
          },
          'Mathematics': {
            id: 'mathematics',
            label: 'Mathematics',
            color: '#7C3AED',
            details: {
              courses: ['B.Sc Mathematics', 'M.Sc Mathematics', 'Statistics'],
              scope: 'Data Scientist, Statistician, Quantitative Analyst, Research Scientist, Actuary',
              duration: '3-5 years',
              avgSalary: '₹4-20 LPA'
            }
          }
        }
      },
      'Environmental Sciences': {
        id: 'environmental',
        label: 'Environmental Sciences',
        color: '#059669',
        children: {
          'Environmental Science': {
            id: 'env-science',
            label: 'Environmental Science',
            color: '#16A34A',
            details: {
              courses: ['B.Sc Environmental Science', 'M.Sc Environmental Science'],
              scope: 'Environmental Consultant, Forest Officer (IFS), Wildlife Biologist, Sustainability Consultant',
              duration: '3-5 years',
              avgSalary: '₹3-12 LPA'
            }
          },
          'Agriculture': {
            id: 'agriculture',
            label: 'Agriculture',
            color: '#84CC16',
            details: {
              courses: ['B.Sc Agriculture', 'B.Tech Agricultural Engineering'],
              scope: 'Agricultural Scientist, Agronomist, Horticulturist, Organic Farming Specialist',
              duration: '4 years',
              avgSalary: '₹3-10 LPA'
            }
          }
        }
      }
    }
  },
  Commerce: {
    id: 'commerce',
    label: 'Commerce',
    color: '#059669',
    children: {
      'Finance & Banking': {
        id: 'finance',
        label: 'Finance & Banking',
        color: '#DC2626',
        children: {
          'Chartered Accountancy': {
            id: 'ca',
            label: 'CA',
            color: '#7C2D12',
            children: {
              'Taxation Specialist': {
                id: 'tax-specialist',
                label: 'Taxation Specialist',
                color: '#991B1B',
                children: {
                  'Direct Tax Consultant': {
                    id: 'direct-tax',
                    label: 'Direct Tax Consultant',
                    color: '#7C2D12',
                    children: {
                      'Income Tax Specialist': {
                        id: 'income-tax-specialist',
                        label: 'Income Tax Specialist',
                        color: '#92400E',
                        children: {
                          'Individual Tax Advisor': {
                            id: 'individual-tax-advisor',
                            label: 'Individual Tax Advisor',
                            color: '#78350F',
                            details: {
                              courses: ['CA', 'Advanced Taxation', 'Income Tax Law'],
                              scope: 'Personal Tax Consultant, HNI Tax Advisor, Tax Planning Specialist',
                              duration: '5-6 years',
                              avgSalary: '₹8-35 LPA'
                            }
                          },
                          'Corporate Tax Advisor': {
                            id: 'corporate-tax-advisor',
                            label: 'Corporate Tax Advisor',
                            color: '#451A03',
                            details: {
                              courses: ['CA', 'Corporate Tax', 'Advanced Taxation'],
                              scope: 'Corporate Tax Manager, Tax Compliance Officer, Tax Strategy Consultant',
                              duration: '6-7 years',
                              avgSalary: '₹12-45 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Indirect Tax Consultant': {
                    id: 'indirect-tax',
                    label: 'Indirect Tax Consultant',
                    color: '#92400E',
                    children: {
                      'GST Specialist': {
                        id: 'gst-specialist',
                        label: 'GST Specialist',
                        color: '#78350F',
                        children: {
                          'GST Compliance Officer': {
                            id: 'gst-compliance',
                            label: 'GST Compliance Officer',
                            color: '#451A03',
                            details: {
                              courses: ['CA', 'GST Law', 'Indirect Tax'],
                              scope: 'GST Consultant, Compliance Manager, Tax Filing Specialist',
                              duration: '4-5 years',
                              avgSalary: '₹6-25 LPA'
                            }
                          },
                          'Customs & Excise Expert': {
                            id: 'customs-excise',
                            label: 'Customs & Excise Expert',
                            color: '#1C0B02',
                            details: {
                              courses: ['CA', 'Customs Law', 'Excise Duty'],
                              scope: 'Customs Advisor, Import-Export Consultant, Trade Compliance Expert',
                              duration: '5-6 years',
                              avgSalary: '₹8-35 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'International Tax Expert': {
                    id: 'international-tax',
                    label: 'International Tax Expert',
                    color: '#78350F',
                    children: {
                      'Transfer Pricing Specialist': {
                        id: 'transfer-pricing',
                        label: 'Transfer Pricing Specialist',
                        color: '#451A03',
                        children: {
                          'Transfer Pricing Analyst': {
                            id: 'tp-analyst',
                            label: 'Transfer Pricing Analyst',
                            color: '#1C0B02',
                            details: {
                              courses: ['CA', 'Transfer Pricing', 'International Tax'],
                              scope: 'TP Documentation Specialist, TP Compliance Officer, Cross-border Tax Analyst',
                              duration: '6-7 years',
                              avgSalary: '₹15-60 LPA'
                            }
                          },
                          'Global Tax Strategist': {
                            id: 'global-tax-strategist',
                            label: 'Global Tax Strategist',
                            color: '#0C0604',
                            details: {
                              courses: ['CA', 'International Taxation', 'Global Tax Strategy'],
                              scope: 'Global Tax Director, International Tax Manager, Tax Optimization Specialist',
                              duration: '7-10 years',
                              avgSalary: '₹25-100 LPA'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              'Audit & Assurance': {
                id: 'audit-assurance',
                label: 'Audit & Assurance',
                color: '#DC2626',
                children: {
                  'External Auditor': {
                    id: 'external-auditor',
                    label: 'External Auditor',
                    color: '#B91C1C',
                    children: {
                      'Statutory Audit': {
                        id: 'statutory-audit',
                        label: 'Statutory Audit',
                        color: '#991B1B',
                        children: {
                          'Senior Audit Associate': {
                            id: 'senior-audit-associate',
                            label: 'Senior Audit Associate',
                            color: '#7F1D1D',
                            details: {
                              courses: ['CA', 'Auditing Standards', 'Risk Assessment'],
                              scope: 'Statutory Auditor, Compliance Auditor, Financial Auditor',
                              duration: '4-5 years',
                              avgSalary: '₹8-30 LPA'
                            }
                          },
                          'Audit Manager': {
                            id: 'audit-manager',
                            label: 'Audit Manager',
                            color: '#450A0A',
                            details: {
                              courses: ['CA', 'Advanced Auditing', 'Team Leadership'],
                              scope: 'Audit Team Leader, Senior Audit Manager, Partner Track',
                              duration: '6-8 years',
                              avgSalary: '₹15-50 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Internal Auditor': {
                    id: 'internal-auditor',
                    label: 'Internal Auditor',
                    color: '#EF4444',
                    children: {
                      'Risk Assessment': {
                        id: 'risk-assessment',
                        label: 'Risk Assessment',
                        color: '#DC2626',
                        children: {
                          'Risk Auditor': {
                            id: 'risk-auditor',
                            label: 'Risk Auditor',
                            color: '#B91C1C',
                            details: {
                              courses: ['CA', 'Internal Audit', 'Risk Management'],
                              scope: 'Internal Audit Manager, Risk Auditor, Operational Auditor',
                              duration: '4-5 years',
                              avgSalary: '₹6-25 LPA'
                            }
                          },
                          'Chief Risk Officer': {
                            id: 'chief-risk-officer',
                            label: 'Chief Risk Officer',
                            color: '#991B1B',
                            details: {
                              courses: ['CA', 'Risk Management', 'Corporate Governance'],
                              scope: 'Chief Risk Officer, Risk Management Head, Compliance Director',
                              duration: '8-12 years',
                              avgSalary: '₹25-80 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Forensic Auditor': {
                    id: 'forensic-auditor',
                    label: 'Forensic Auditor',
                    color: '#F87171',
                    children: {
                      'Fraud Investigation': {
                        id: 'fraud-investigation',
                        label: 'Fraud Investigation',
                        color: '#EF4444',
                        children: {
                          'Forensic Accountant': {
                            id: 'forensic-accountant',
                            label: 'Forensic Accountant',
                            color: '#DC2626',
                            details: {
                              courses: ['CA', 'Forensic Accounting', 'Investigation Techniques'],
                              scope: 'Fraud Investigator, Financial Crime Analyst, Litigation Support',
                              duration: '5-6 years',
                              avgSalary: '₹12-45 LPA'
                            }
                          },
                          'Financial Crime Specialist': {
                            id: 'financial-crime-specialist',
                            label: 'Financial Crime Specialist',
                            color: '#B91C1C',
                            details: {
                              courses: ['CA', 'Financial Crime Investigation', 'Legal Procedures'],
                              scope: 'Financial Crime Investigator, Expert Witness, Litigation Consultant',
                              duration: '6-8 years',
                              avgSalary: '₹18-65 LPA'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              'Financial Advisory': {
                id: 'financial-advisory',
                label: 'Financial Advisory',
                color: '#DC2626',
                children: {
                  'Personal Financial Advisor': {
                    id: 'personal-advisor',
                    label: 'Personal Financial Advisor',
                    color: '#B91C1C',
                    children: {
                      'Wealth Management': {
                        id: 'wealth-management',
                        label: 'Wealth Management',
                        color: '#991B1B',
                        children: {
                          'Private Wealth Manager': {
                            id: 'private-wealth-manager',
                            label: 'Private Wealth Manager',
                            color: '#7F1D1D',
                            details: {
                              courses: ['CA', 'CFP', 'Wealth Management'],
                              scope: 'HNI Wealth Manager, Family Office Advisor, Private Banking',
                              duration: '5-7 years',
                              avgSalary: '₹15-60 LPA'
                            }
                          },
                          'Investment Advisor': {
                            id: 'investment-advisor',
                            label: 'Investment Advisor',
                            color: '#450A0A',
                            details: {
                              courses: ['CFP', 'Investment Planning', 'Portfolio Management'],
                              scope: 'Investment Advisor, Portfolio Counselor, Retirement Planner',
                              duration: '4-6 years',
                              avgSalary: '₹8-40 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Corporate Financial Advisor': {
                    id: 'corporate-advisor',
                    label: 'Corporate Financial Advisor',
                    color: '#EF4444',
                    children: {
                      'Corporate Finance': {
                        id: 'corporate-finance',
                        label: 'Corporate Finance',
                        color: '#DC2626',
                        children: {
                          'CFO & Finance Director': {
                            id: 'cfo-finance-director',
                            label: 'CFO & Finance Director',
                            color: '#B91C1C',
                            details: {
                              courses: ['CA', 'Corporate Finance', 'Strategic Management'],
                              scope: 'CFO, Finance Director, Group CFO, Financial Controller',
                              duration: '8-12 years',
                              avgSalary: '₹30-150 LPA'
                            }
                          },
                          'M&A Advisor': {
                            id: 'ma-advisor',
                            label: 'M&A Advisor',
                            color: '#991B1B',
                            details: {
                              courses: ['CA', 'M&A', 'Corporate Restructuring'],
                              scope: 'M&A Advisor, Corporate Development, Business Restructuring Consultant',
                              duration: '6-8 years',
                              avgSalary: '₹15-80 LPA'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Investment Banking': {
            id: 'investment-banking',
            label: 'Investment Banking',
            color: '#BE123C',
            children: {
              'Equity Research': {
                id: 'equity-research',
                label: 'Equity Research',
                color: '#991B1B',
                children: {
                  'Equity Research Analyst': {
                    id: 'equity-analyst',
                    label: 'Equity Research Analyst',
                    color: '#7C2D12',
                    children: {
                      'Sector Analysis': {
                        id: 'sector-analysis',
                        label: 'Sector Analysis',
                        color: '#92400E',
                        children: {
                          'Buy-side Analyst': {
                            id: 'buy-side-analyst',
                            label: 'Buy-side Analyst',
                            color: '#78350F',
                            details: {
                              courses: ['CFA', 'MBA Finance', 'Equity Research'],
                              scope: 'Mutual Fund Analyst, Institutional Research, Investment Analysis',
                              duration: '4-6 years',
                              avgSalary: '₹15-65 LPA'
                            }
                          },
                          'Sell-side Analyst': {
                            id: 'sell-side-analyst',
                            label: 'Sell-side Analyst',
                            color: '#451A03',
                            details: {
                              courses: ['CFA', 'Financial Modeling', 'Sector Research'],
                              scope: 'Investment Banking Research, Brokerage Research, Market Analysis',
                              duration: '4-5 years',
                              avgSalary: '₹12-50 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Portfolio Manager': {
                    id: 'portfolio-manager',
                    label: 'Portfolio Manager',
                    color: '#92400E',
                    children: {
                      'Fund Management': {
                        id: 'fund-management',
                        label: 'Fund Management',
                        color: '#78350F',
                        children: {
                          'Mutual Fund Manager': {
                            id: 'mutual-fund-manager',
                            label: 'Mutual Fund Manager',
                            color: '#451A03',
                            details: {
                              courses: ['CFA', 'FRM', 'Portfolio Management'],
                              scope: 'Equity Fund Manager, Debt Fund Manager, Hybrid Fund Manager',
                              duration: '6-8 years',
                              avgSalary: '₹25-120 LPA'
                            }
                          },
                          'Alternative Investment Manager': {
                            id: 'alternative-investment-manager',
                            label: 'Alternative Investment Manager',
                            color: '#1C0B02',
                            details: {
                              courses: ['CFA', 'Alternative Investments', 'Hedge Fund Management'],
                              scope: 'Hedge Fund Manager, Private Equity, Real Estate Fund Manager',
                              duration: '7-10 years',
                              avgSalary: '₹30-200 LPA'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              'Investment Banking Operations': {
                id: 'ib-operations',
                label: 'IB Operations',
                color: '#DC2626',
                children: {
                  'M&A Analyst': {
                    id: 'ma-analyst',
                    label: 'M&A Analyst',
                    color: '#B91C1C',
                    children: {
                      'Deal Execution': {
                        id: 'deal-execution',
                        label: 'Deal Execution',
                        color: '#991B1B',
                        children: {
                          'M&A Associate': {
                            id: 'ma-associate',
                            label: 'M&A Associate',
                            color: '#7F1D1D',
                            details: {
                              courses: ['MBA Finance', 'M&A Modeling', 'Valuation'],
                              scope: 'M&A Analyst, Deal Manager, Corporate Development Associate',
                              duration: '4-6 years',
                              avgSalary: '₹15-70 LPA'
                            }
                          },
                          'M&A Vice President': {
                            id: 'ma-vp',
                            label: 'M&A Vice President',
                            color: '#450A0A',
                            details: {
                              courses: ['Advanced M&A', 'Deal Leadership', 'Client Management'],
                              scope: 'M&A VP, Deal Leader, Senior M&A Advisor',
                              duration: '7-10 years',
                              avgSalary: '₹30-150 LPA'
                            }
                          }
                        }
                      }
                    }
                  },
                  'Capital Markets Analyst': {
                    id: 'capital-markets',
                    label: 'Capital Markets Analyst',
                    color: '#EF4444',
                    children: {
                      'Capital Markets Operations': {
                        id: 'capital-markets-ops',
                        label: 'Capital Markets Operations',
                        color: '#DC2626',
                        children: {
                          'IPO Specialist': {
                            id: 'ipo-specialist',
                            label: 'IPO Specialist',
                            color: '#B91C1C',
                            details: {
                              courses: ['MBA Finance', 'Capital Markets', 'IPO Process'],
                              scope: 'IPO Manager, Public Offering Specialist, Capital Markets Associate',
                              duration: '4-6 years',
                              avgSalary: '₹12-60 LPA'
                            }
                          },
                          'Debt Capital Markets': {
                            id: 'debt-capital-markets',
                            label: 'Debt Capital Markets',
                            color: '#991B1B',
                            details: {
                              courses: ['Bond Markets', 'Fixed Income', 'Credit Analysis'],
                              scope: 'Bond Underwriter, Credit Analyst, Debt Structuring Specialist',
                              duration: '4-6 years',
                              avgSalary: '₹10-55 LPA'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Commercial Banking': {
            id: 'commercial-banking',
            label: 'Commercial Banking',
            color: '#0891B2',
            children: {
              'Retail Banking': {
                id: 'retail-banking',
                label: 'Retail Banking',
                color: '#0E7490',
                children: {
                  'Relationship Manager': {
                    id: 'relationship-manager',
                    label: 'Relationship Manager',
                    color: '#0F766E',
                    details: {
                      courses: ['MBA Banking', 'Customer Relationship', 'Sales Training'],
                      scope: 'Personal Banking RM, Priority Banking RM, Wealth RM',
                      duration: '3-4 years',
                      avgSalary: '₹6-20 LPA'
                    }
                  },
                  'Credit Analyst': {
                    id: 'credit-analyst',
                    label: 'Credit Analyst',
                    color: '#0D9488',
                    details: {
                      courses: ['Finance', 'Credit Risk', 'Financial Analysis'],
                      scope: 'Loan Officer, Credit Risk Analyst, Underwriter',
                      duration: '3-5 years',
                      avgSalary: '₹5-18 LPA'
                    }
                  }
                }
              },
              'Corporate Banking': {
                id: 'corporate-banking',
                label: 'Corporate Banking',
                color: '#0891B2',
                children: {
                  'Corporate Credit Manager': {
                    id: 'corporate-credit',
                    label: 'Corporate Credit Manager',
                    color: '#0E7490',
                    details: {
                      courses: ['MBA Finance', 'Corporate Credit', 'Risk Management'],
                      scope: 'Corporate Lending, Trade Finance, Working Capital Finance',
                      duration: '5-7 years',
                      avgSalary: '₹10-35 LPA'
                    }
                  },
                  'Transaction Banking': {
                    id: 'transaction-banking',
                    label: 'Transaction Banking',
                    color: '#0F766E',
                    details: {
                      courses: ['Trade Finance', 'Cash Management', 'Treasury Operations'],
                      scope: 'Trade Finance Officer, Cash Management Specialist, Treasury Analyst',
                      duration: '4-6 years',
                      avgSalary: '₹8-25 LPA'
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Business & Management': {
        id: 'management',
        label: 'Business & Management',
        color: '#7C3AED',
        children: {
          'General Management': {
            id: 'general-mgmt',
            label: 'General Management',
            color: '#6D28D9',
            children: {
              'Operations Management': {
                id: 'operations-mgmt',
                label: 'Operations Management',
                color: '#5B21B6',
                children: {
                  'Production Manager': {
                    id: 'production-manager',
                    label: 'Production Manager',
                    color: '#4C1D95',
                    details: {
                      courses: ['MBA Operations', 'Production Planning', 'Quality Management'],
                      scope: 'Plant Manager, Production Supervisor, Quality Control Manager',
                      duration: '4-6 years',
                      avgSalary: '₹8-25 LPA'
                    }
                  },
                  'Supply Chain Manager': {
                    id: 'supply-chain-mgr',
                    label: 'Supply Chain Manager',
                    color: '#3730A3',
                    details: {
                      courses: ['MBA SCM', 'Logistics', 'Procurement'],
                      scope: 'Logistics Manager, Procurement Manager, Warehouse Manager',
                      duration: '4-6 years',
                      avgSalary: '₹7-22 LPA'
                    }
                  },
                  'Project Manager': {
                    id: 'project-manager',
                    label: 'Project Manager',
                    color: '#312E81',
                    details: {
                      courses: ['PMP', 'Agile', 'Project Management'],
                      scope: 'IT Project Manager, Construction PM, Business Project Manager',
                      duration: '5-7 years',
                      avgSalary: '₹10-35 LPA'
                    }
                  }
                }
              },
              'Strategic Management': {
                id: 'strategic-mgmt',
                label: 'Strategic Management',
                color: '#7C3AED',
                children: {
                  'Business Analyst': {
                    id: 'business-analyst',
                    label: 'Business Analyst',
                    color: '#6D28D9',
                    details: {
                      courses: ['MBA', 'Business Analysis', 'Data Analytics'],
                      scope: 'Systems Analyst, Process Analyst, Strategy Consultant',
                      duration: '4-5 years',
                      avgSalary: '₹8-30 LPA'
                    }
                  },
                  'Management Consultant': {
                    id: 'mgmt-consultant',
                    label: 'Management Consultant',
                    color: '#5B21B6',
                    details: {
                      courses: ['MBA', 'Strategy', 'Consulting'],
                      scope: 'Strategy Consultant, Process Consultant, Organizational Development',
                      duration: '5-8 years',
                      avgSalary: '₹15-60 LPA'
                    }
                  }
                }
              }
            }
          },
          'Human Resources': {
            id: 'hr',
            label: 'Human Resources',
            color: '#16A34A',
            children: {
              'Talent Management': {
                id: 'talent-mgmt',
                label: 'Talent Management',
                color: '#15803D',
                children: {
                  'Recruitment Specialist': {
                    id: 'recruitment-specialist',
                    label: 'Recruitment Specialist',
                    color: '#166534',
                    details: {
                      courses: ['MBA HR', 'Talent Acquisition', 'Recruitment'],
                      scope: 'Talent Acquisition Manager, Headhunter, Campus Recruiter',
                      duration: '3-5 years',
                      avgSalary: '₹5-18 LPA'
                    }
                  },
                  'Learning & Development': {
                    id: 'learning-dev',
                    label: 'Learning & Development',
                    color: '#14532D',
                    details: {
                      courses: ['MBA HR', 'Training & Development', 'Instructional Design'],
                      scope: 'Training Manager, L&D Specialist, Corporate Trainer',
                      duration: '4-6 years',
                      avgSalary: '₹6-20 LPA'
                    }
                  },
                  'Performance Management': {
                    id: 'performance-mgmt',
                    label: 'Performance Management',
                    color: '#052E16',
                    details: {
                      courses: ['MBA HR', 'Performance Management', 'OD'],
                      scope: 'Performance Manager, OD Consultant, HR Business Partner',
                      duration: '5-7 years',
                      avgSalary: '₹8-25 LPA'
                    }
                  }
                }
              }
            }
          },
          'Marketing & Sales': {
            id: 'marketing',
            label: 'Marketing & Sales',
            color: '#F59E0B',
            children: {
              'Digital Marketing': {
                id: 'digital-marketing-mgmt',
                label: 'Digital Marketing',
                color: '#D97706',
                children: {
                  'Social Media Manager': {
                    id: 'social-media-mgr',
                    label: 'Social Media Manager',
                    color: '#B45309',
                    details: {
                      courses: ['Digital Marketing', 'Social Media Strategy', 'Content Marketing'],
                      scope: 'Social Media Strategist, Community Manager, Influencer Manager',
                      duration: '2-4 years',
                      avgSalary: '₹4-15 LPA'
                    }
                  },
                  'SEO/SEM Specialist': {
                    id: 'seo-sem-specialist',
                    label: 'SEO/SEM Specialist',
                    color: '#92400E',
                    details: {
                      courses: ['SEO', 'Google Ads', 'Digital Marketing'],
                      scope: 'SEO Manager, PPC Manager, Digital Marketing Analyst',
                      duration: '2-4 years',
                      avgSalary: '₹5-18 LPA'
                    }
                  }
                }
              },
              'Brand Management': {
                id: 'brand-mgmt',
                label: 'Brand Management',
                color: '#F59E0B',
                children: {
                  'Brand Manager': {
                    id: 'brand-manager',
                    label: 'Brand Manager',
                    color: '#D97706',
                    details: {
                      courses: ['MBA Marketing', 'Brand Management', 'Consumer Insights'],
                      scope: 'Product Manager, Brand Strategist, Marketing Manager',
                      duration: '4-6 years',
                      avgSalary: '₹8-30 LPA'
                    }
                  },
                  'Sales Manager': {
                    id: 'sales-manager',
                    label: 'Sales Manager',
                    color: '#B45309',
                    details: {
                      courses: ['MBA Sales', 'Sales Management', 'CRM'],
                      scope: 'Regional Sales Manager, Key Account Manager, Sales Director',
                      duration: '4-7 years',
                      avgSalary: '₹7-35 LPA'
                    }
                  }
                }
              }
            }
          }
        }
      },
      'E-commerce & Digital': {
        id: 'ecommerce',
        label: 'E-commerce & Digital',
        color: '#8B5CF6',
        children: {
          'E-commerce Management': {
            id: 'ecom-mgmt',
            label: 'E-commerce Management',
            color: '#7C3AED',
            details: {
              courses: ['B.Com E-commerce', 'Digital Business', 'E-commerce Certification'],
              scope: 'E-commerce Manager, Category Manager, Customer Experience Manager, Growth Hacker',
              duration: '3-4 years',
              avgSalary: '₹4-20 LPA'
            }
          },
          'Digital Marketing': {
            id: 'digital-marketing',
            label: 'Digital Marketing',
            color: '#EC4899',
            details: {
              courses: ['Digital Marketing Certification', 'Google Ads', 'SEO/SEM'],
              scope: 'SEO Specialist, Social Media Manager, Content Marketing, PPC Manager, Influencer Marketing',
              duration: '6 months - 2 years',
              avgSalary: '₹3-15 LPA'
            }
          }
        }
      },
      'Economics & Research': {
        id: 'economics',
        label: 'Economics & Research',
        color: '#059669',
        children: {
          'Economics': {
            id: 'economist',
            label: 'Economics',
            color: '#0891B2',
            details: {
              courses: ['B.A Economics', 'M.A Economics', 'PhD Economics'],
              scope: 'Economist, Economic Researcher, Policy Analyst, Market Research Analyst',
              duration: '3-6 years',
              avgSalary: '₹4-15 LPA'
            }
          },
          'Statistics': {
            id: 'statistics',
            label: 'Statistics',
            color: '#DC2626',
            details: {
              courses: ['B.Sc Statistics', 'M.Sc Statistics', 'Data Analytics'],
              scope: 'Data Analyst, Statistician, Market Researcher, Business Analyst',
              duration: '3-5 years',
              avgSalary: '₹4-18 LPA'
            }
          }
        }
      }
    }
  },
  Arts: {
    id: 'arts',
    label: 'Arts & Humanities',
    color: '#DC2626',
    children: {
      'Civil Services': {
        id: 'civil-services',
        label: 'Civil Services',
        color: '#059669',
        children: {
          'UPSC': {
            id: 'upsc',
            label: 'UPSC Services',
            color: '#DC2626',
            details: {
              courses: ['Any Graduate + UPSC Preparation'],
              scope: 'IAS, IPS, IFS, IRS - Administrative, Police, Foreign, Revenue Services',
              duration: '3-5 years prep',
              avgSalary: '₹15-50 LPA'
            }
          },
          'State Services': {
            id: 'state-services',
            label: 'State Services',
            color: '#059669',
            details: {
              courses: ['Any Graduate + State PSC'],
              scope: 'State Civil Services, State Police, Municipal Services, Panchayati Raj',
              duration: '2-4 years prep',
              avgSalary: '₹8-25 LPA'
            }
          },
          'Defense Services': {
            id: 'defense',
            label: 'Defense Services',
            color: '#7C2D12',
            details: {
              courses: ['Any Graduate + NDA/CDS'],
              scope: 'Army Officer, Navy Officer, Air Force Officer, Military Engineer',
              duration: '4 years training',
              avgSalary: '₹8-30 LPA'
            }
          }
        }
      },
      'Law & Legal Studies': {
        id: 'law',
        label: 'Law & Legal Studies',
        color: '#7C3AED',
        children: {
          'Corporate Law': {
            id: 'corporate-law',
            label: 'Corporate Law',
            color: '#6D28D9',
            children: {
              'Commercial Litigation': {
                id: 'commercial-litigation',
                label: 'Commercial Litigation',
                color: '#5B21B6',
                children: {
                  'Corporate Lawyer': {
                    id: 'corporate-lawyer',
                    label: 'Corporate Lawyer',
                    color: '#4C1D95',
                    details: {
                      courses: ['LLB', 'LLM Corporate Law', 'Company Law'],
                      scope: 'In-house Counsel, Corporate Legal Advisor, Compliance Officer',
                      duration: '5-7 years',
                      avgSalary: '₹10-50 LPA'
                    }
                  },
                  'Litigation Lawyer': {
                    id: 'litigation-lawyer',
                    label: 'Litigation Lawyer',
                    color: '#3730A3',
                    details: {
                      courses: ['LLB', 'Civil Procedure', 'Evidence Law'],
                      scope: 'Civil Lawyer, Commercial Litigator, Dispute Resolution',
                      duration: '5-8 years',
                      avgSalary: '₹8-40 LPA'
                    }
                  },
                  'Arbitration Specialist': {
                    id: 'arbitration-specialist',
                    label: 'Arbitration Specialist',
                    color: '#312E81',
                    details: {
                      courses: ['LLB', 'Arbitration Law', 'Alternative Dispute Resolution'],
                      scope: 'Arbitrator, Mediator, ADR Specialist',
                      duration: '6-10 years',
                      avgSalary: '₹15-80 LPA'
                    }
                  }
                }
              },
              'Intellectual Property': {
                id: 'ip-law',
                label: 'Intellectual Property',
                color: '#7C3AED',
                children: {
                  'Patent Attorney': {
                    id: 'patent-attorney',
                    label: 'Patent Attorney',
                    color: '#6D28D9',
                    details: {
                      courses: ['LLB', 'Patent Law', 'IP Rights'],
                      scope: 'Patent Agent, IP Lawyer, Technology Transfer Specialist',
                      duration: '5-7 years',
                      avgSalary: '₹12-60 LPA'
                    }
                  },
                  'Trademark Attorney': {
                    id: 'trademark-attorney',
                    label: 'Trademark Attorney',
                    color: '#5B21B6',
                    details: {
                      courses: ['LLB', 'Trademark Law', 'Brand Protection'],
                      scope: 'Trademark Agent, Brand Protection Lawyer, IP Consultant',
                      duration: '4-6 years',
                      avgSalary: '₹8-35 LPA'
                    }
                  }
                }
              }
            }
          },
          'Criminal Law': {
            id: 'criminal-law',
            label: 'Criminal Law',
            color: '#DC2626',
            children: {
              'Criminal Defense': {
                id: 'criminal-defense',
                label: 'Criminal Defense',
                color: '#B91C1C',
                children: {
                  'Criminal Lawyer': {
                    id: 'criminal-lawyer',
                    label: 'Criminal Defense Lawyer',
                    color: '#991B1B',
                    details: {
                      courses: ['LLB', 'Criminal Law', 'Criminal Procedure'],
                      scope: 'Defense Attorney, Criminal Advocate, Public Defender',
                      duration: '5-8 years',
                      avgSalary: '₹6-30 LPA'
                    }
                  },
                  'Prosecutor': {
                    id: 'prosecutor',
                    label: 'Public Prosecutor',
                    color: '#7F1D1D',
                    details: {
                      courses: ['LLB', 'Criminal Law', 'Public Prosecution'],
                      scope: 'Public Prosecutor, Government Pleader, Special Prosecutor',
                      duration: '5-10 years',
                      avgSalary: '₹8-25 LPA'
                    }
                  }
                }
              }
            }
          },
          'Family & Personal Law': {
            id: 'family-law',
            label: 'Family & Personal Law',
            color: '#EC4899',
            children: {
              'Family Law Practice': {
                id: 'family-practice',
                label: 'Family Law Practice',
                color: '#DB2777',
                children: {
                  'Family Lawyer': {
                    id: 'family-lawyer',
                    label: 'Family Lawyer',
                    color: '#BE185D',
                    details: {
                      courses: ['LLB', 'Family Law', 'Personal Laws'],
                      scope: 'Divorce Lawyer, Child Custody Lawyer, Family Court Advocate',
                      duration: '4-6 years',
                      avgSalary: '₹5-25 LPA'
                    }
                  },
                  'Legal Counselor': {
                    id: 'legal-counselor',
                    label: 'Legal Counselor',
                    color: '#A21CAF',
                    details: {
                      courses: ['LLB', 'Counseling', 'Mediation'],
                      scope: 'Family Counselor, Legal Advisor, Mediation Specialist',
                      duration: '4-6 years',
                      avgSalary: '₹4-18 LPA'
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Media & Communication': {
        id: 'media',
        label: 'Media & Communication',
        color: '#F59E0B',
        children: {
          'Digital Media': {
            id: 'digital-media',
            label: 'Digital Media',
            color: '#D97706',
            children: {
              'Content Creation': {
                id: 'content-creation',
                label: 'Content Creation',
                color: '#B45309',
                children: {
                  'Content Writer': {
                    id: 'content-writer',
                    label: 'Content Writer',
                    color: '#92400E',
                    details: {
                      courses: ['Mass Communication', 'Content Writing', 'Digital Marketing'],
                      scope: 'Blog Writer, Copywriter, Technical Writer, Social Media Content Creator',
                      duration: '1-3 years',
                      avgSalary: '₹3-12 LPA'
                    }
                  },
                  'Video Content Creator': {
                    id: 'video-creator',
                    label: 'Video Content Creator',
                    color: '#78350F',
                    details: {
                      courses: ['Video Production', 'Editing', 'Storytelling'],
                      scope: 'YouTuber, Video Editor, Documentary Maker, Social Media Video Creator',
                      duration: '1-3 years',
                      avgSalary: '₹2-15 LPA'
                    }
                  },
                  'Podcast Producer': {
                    id: 'podcast-producer',
                    label: 'Podcast Producer',
                    color: '#451A03',
                    details: {
                      courses: ['Audio Production', 'Broadcasting', 'Content Strategy'],
                      scope: 'Podcast Host, Audio Producer, Radio Producer, Voice-over Artist',
                      duration: '1-2 years',
                      avgSalary: '₹2-10 LPA'
                    }
                  }
                }
              },
              'Digital Journalism': {
                id: 'digital-journalism',
                label: 'Digital Journalism',
                color: '#F59E0B',
                children: {
                  'Online Journalist': {
                    id: 'online-journalist',
                    label: 'Online Journalist',
                    color: '#D97706',
                    details: {
                      courses: ['Journalism', 'Digital Media', 'Data Journalism'],
                      scope: 'Digital Reporter, News Website Editor, Multimedia Journalist',
                      duration: '3-4 years',
                      avgSalary: '₹4-15 LPA'
                    }
                  },
                  'Investigative Journalist': {
                    id: 'investigative-journalist',
                    label: 'Investigative Journalist',
                    color: '#B45309',
                    details: {
                      courses: ['Journalism', 'Research Methods', 'Media Ethics'],
                      scope: 'Investigative Reporter, Documentary Journalist, News Anchor',
                      duration: '4-6 years',
                      avgSalary: '₹5-20 LPA'
                    }
                  }
                }
              }
            }
          },
          'Film & Television Production': {
            id: 'film-tv-production',
            label: 'Film & TV Production',
            color: '#8B5CF6',
            children: {
              'Direction & Production': {
                id: 'direction-production',
                label: 'Direction & Production',
                color: '#7C3AED',
                children: {
                  'Film Director': {
                    id: 'film-director',
                    label: 'Film Director',
                    color: '#6D28D9',
                    details: {
                      courses: ['Film Direction', 'Cinematography', 'Screenwriting'],
                      scope: 'Movie Director, TV Director, Web Series Director, Commercial Director',
                      duration: '4-6 years',
                      avgSalary: '₹5-50 LPA'
                    }
                  },
                  'Producer': {
                    id: 'producer',
                    label: 'Producer',
                    color: '#5B21B6',
                    details: {
                      courses: ['Film Production', 'Media Management', 'Finance'],
                      scope: 'Film Producer, TV Producer, Executive Producer, Content Producer',
                      duration: '5-8 years',
                      avgSalary: '₹8-100 LPA'
                    }
                  },
                  'Cinematographer': {
                    id: 'cinematographer',
                    label: 'Cinematographer',
                    color: '#4C1D95',
                    details: {
                      courses: ['Cinematography', 'Camera Operation', 'Lighting'],
                      scope: 'Director of Photography, Camera Operator, Visual Storyteller',
                      duration: '4-6 years',
                      avgSalary: '₹6-30 LPA'
                    }
                  }
                }
              },
              'Post-Production': {
                id: 'post-production',
                label: 'Post-Production',
                color: '#8B5CF6',
                children: {
                  'Video Editor': {
                    id: 'video-editor',
                    label: 'Video Editor',
                    color: '#7C3AED',
                    details: {
                      courses: ['Video Editing', 'Final Cut Pro', 'Adobe Premiere'],
                      scope: 'Film Editor, TV Editor, YouTube Editor, Commercial Editor',
                      duration: '2-4 years',
                      avgSalary: '₹4-18 LPA'
                    }
                  },
                  'VFX Artist': {
                    id: 'vfx-artist',
                    label: 'VFX Artist',
                    color: '#6D28D9',
                    details: {
                      courses: ['VFX', 'Animation', '3D Modeling', 'Compositing'],
                      scope: 'Visual Effects Artist, 3D Artist, Compositor, Motion Graphics Designer',
                      duration: '3-5 years',
                      avgSalary: '₹5-25 LPA'
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Education & Teaching': {
        id: 'education',
        label: 'Education & Teaching',
        color: '#16A34A',
        children: {
          'School Teaching': {
            id: 'school-teaching',
            label: 'School Teaching',
            color: '#059669',
            details: {
              courses: ['B.Ed', 'M.Ed', 'Subject Graduate + B.Ed'],
              scope: 'Primary Teacher, Secondary Teacher, Higher Secondary Teacher, Principal, Education Administrator',
              duration: '4-5 years',
              avgSalary: '₹3-12 LPA'
            }
          },
          'Higher Education': {
            id: 'higher-education',
            label: 'Higher Education',
            color: '#0891B2',
            details: {
              courses: ['M.A', 'M.Phil', 'PhD', 'NET/SET'],
              scope: 'College Professor, University Lecturer, Research Scholar, Education Consultant',
              duration: '5-8 years',
              avgSalary: '₹5-25 LPA'
            }
          },
          'Educational Technology': {
            id: 'ed-tech',
            label: 'Educational Technology',
            color: '#7C3AED',
            details: {
              courses: ['Instructional Design', 'E-Learning', 'Educational Psychology'],
              scope: 'Instructional Designer, E-Learning Developer, Online Course Creator, EdTech Specialist',
              duration: '3-4 years',
              avgSalary: '₹4-15 LPA'
            }
          }
        }
      },
      'Creative Arts': {
        id: 'creative-arts',
        label: 'Creative Arts',
        color: '#EC4899',
        children: {
          'Visual Arts': {
            id: 'visual-arts',
            label: 'Visual Arts',
            color: '#BE123C',
            details: {
              courses: ['Fine Arts', 'Applied Arts', 'Graphic Design', 'Animation'],
              scope: 'Graphic Designer, UI/UX Designer, Animator, Illustrator, Art Director',
              duration: '3-4 years',
              avgSalary: '₹3-20 LPA'
            }
          },
          'Performing Arts': {
            id: 'performing-arts',
            label: 'Performing Arts',
            color: '#7C3AED',
            details: {
              courses: ['Music', 'Dance', 'Theatre', 'Acting'],
              scope: 'Actor, Musician, Dancer, Choreographer, Music Director, Theatre Artist',
              duration: '3-6 years',
              avgSalary: '₹2-50 LPA'
            }
          },
          'Fashion & Design': {
            id: 'fashion-design',
            label: 'Fashion & Design',
            color: '#F59E0B',
            details: {
              courses: ['Fashion Design', 'Interior Design', 'Product Design'],
              scope: 'Fashion Designer, Interior Designer, Product Designer, Textile Designer',
              duration: '3-4 years',
              avgSalary: '₹3-18 LPA'
            }
          }
        }
      },
      'Social Sciences': {
        id: 'social-sciences',
        label: 'Social Sciences',
        color: '#0891B2',
        children: {
          'Psychology': {
            id: 'psychology',
            label: 'Psychology',
            color: '#8B5CF6',
            details: {
              courses: ['B.A Psychology', 'M.A Psychology', 'Clinical Psychology'],
              scope: 'Clinical Psychologist, Counseling Psychologist, Organizational Psychologist, Therapist',
              duration: '4-6 years',
              avgSalary: '₹4-15 LPA'
            }
          },
          'Social Work': {
            id: 'social-work',
            label: 'Social Work',
            color: '#16A34A',
            details: {
              courses: ['BSW', 'MSW', 'Social Work Specialization'],
              scope: 'Social Worker, NGO Manager, Community Development Officer, Policy Researcher',
              duration: '3-5 years',
              avgSalary: '₹3-10 LPA'
            }
          },
          'Political Science': {
            id: 'political-science',
            label: 'Political Science',
            color: '#DC2626',
            details: {
              courses: ['B.A Political Science', 'M.A Political Science', 'Public Administration'],
              scope: 'Policy Analyst, Political Researcher, Diplomat, International Relations Expert',
              duration: '3-5 years',
              avgSalary: '₹4-20 LPA'
            }
          }
        }
      }
    }
  },
  Vocational: {
    id: 'vocational',
    label: 'Vocational & Skills',
    color: '#F59E0B',
    children: {
      'Technical Trades': {
        id: 'technical-trades',
        label: 'Technical Trades',
        color: '#8B5CF6',
        children: {
          'Electrical Trades': {
            id: 'electrical-trades',
            label: 'Electrical Trades',
            color: '#0EA5E9',
            children: {
              'Industrial Electrician': {
                id: 'industrial-electrician',
                label: 'Industrial Electrician',
                color: '#0284C7',
                children: {
                  'Power Plant Electrician': {
                    id: 'power-plant-electrician',
                    label: 'Power Plant Electrician',
                    color: '#0369A1',
                    details: {
                      courses: ['ITI Electrician', 'Power Plant Operations', 'Electrical Safety'],
                      scope: 'Power Plant Technician, Electrical Maintenance, Grid Operator',
                      duration: '2-3 years',
                      avgSalary: '₹3-10 LPA'
                    }
                  },
                  'Industrial Maintenance': {
                    id: 'industrial-maintenance',
                    label: 'Industrial Maintenance',
                    color: '#0C4A6E',
                    details: {
                      courses: ['ITI Electrician', 'Industrial Automation', 'PLC Programming'],
                      scope: 'Maintenance Electrician, Automation Technician, Control Panel Operator',
                      duration: '2-3 years',
                      avgSalary: '₹4-12 LPA'
                    }
                  },
                  'Building Electrician': {
                    id: 'building-electrician',
                    label: 'Building Electrician',
                    color: '#075985',
                    details: {
                      courses: ['ITI Electrician', 'Building Wiring', 'Electrical Codes'],
                      scope: 'Residential Electrician, Commercial Electrician, Electrical Contractor',
                      duration: '1.5-2 years',
                      avgSalary: '₹2.5-8 LPA'
                    }
                  }
                }
              },
              'Electronics Technician': {
                id: 'electronics-tech',
                label: 'Electronics Technician',
                color: '#10B981',
                children: {
                  'Mobile Repair Technician': {
                    id: 'mobile-repair',
                    label: 'Mobile Repair Technician',
                    color: '#059669',
                    details: {
                      courses: ['Mobile Repairing', 'Electronics', 'Circuit Analysis'],
                      scope: 'Mobile Repair Shop Owner, Service Center Technician, Freelance Repair',
                      duration: '6-12 months',
                      avgSalary: '₹2-6 LPA'
                    }
                  },
                  'Home Appliance Technician': {
                    id: 'appliance-tech',
                    label: 'Home Appliance Technician',
                    color: '#047857',
                    details: {
                      courses: ['Electronics', 'Appliance Repair', 'Refrigeration'],
                      scope: 'AC Technician, Refrigerator Repair, Washing Machine Service',
                      duration: '1-2 years',
                      avgSalary: '₹2.5-8 LPA'
                    }
                  }
                }
              }
            }
          },
          'Mechanical Trades': {
            id: 'mechanical-trades',
            label: 'Mechanical Trades',
            color: '#F59E0B',
            children: {
              'Automotive Service': {
                id: 'automotive-service',
                label: 'Automotive Service',
                color: '#D97706',
                children: {
                  'Car Mechanic': {
                    id: 'car-mechanic',
                    label: 'Car Mechanic',
                    color: '#B45309',
                    details: {
                      courses: ['ITI Motor Mechanic', 'Automotive Technology', 'Engine Repair'],
                      scope: 'Auto Repair Shop, Service Center Mechanic, Diagnostic Technician',
                      duration: '1-2 years',
                      avgSalary: '₹2.5-8 LPA'
                    }
                  },
                  'Two Wheeler Mechanic': {
                    id: 'two-wheeler-mechanic',
                    label: 'Two Wheeler Mechanic',
                    color: '#92400E',
                    details: {
                      courses: ['Two Wheeler Repair', 'Engine Mechanics', 'Electrical Systems'],
                      scope: 'Bike Repair Shop, Service Center, Mobile Mechanic',
                      duration: '6-12 months',
                      avgSalary: '₹2-6 LPA'
                    }
                  },
                  'Heavy Vehicle Mechanic': {
                    id: 'heavy-vehicle-mechanic',
                    label: 'Heavy Vehicle Mechanic',
                    color: '#78350F',
                    details: {
                      courses: ['Heavy Vehicle Mechanics', 'Diesel Engine', 'Hydraulics'],
                      scope: 'Truck Mechanic, Bus Mechanic, Construction Equipment Service',
                      duration: '1.5-2 years',
                      avgSalary: '₹3-10 LPA'
                    }
                  }
                }
              },
              'Manufacturing Trades': {
                id: 'manufacturing-trades',
                label: 'Manufacturing Trades',
                color: '#F59E0B',
                children: {
                  'Machinist': {
                    id: 'machinist',
                    label: 'Machinist',
                    color: '#D97706',
                    details: {
                      courses: ['ITI Machinist', 'CNC Operation', 'Precision Machining'],
                      scope: 'CNC Operator, Machine Operator, Tool & Die Maker',
                      duration: '1-2 years',
                      avgSalary: '₹3-10 LPA'
                    }
                  },
                  'Welder': {
                    id: 'welder',
                    label: 'Welder',
                    color: '#B45309',
                    details: {
                      courses: ['ITI Welder', 'Arc Welding', 'Gas Welding', 'TIG/MIG Welding'],
                      scope: 'Construction Welder, Industrial Welder, Pipeline Welder',
                      duration: '1-1.5 years',
                      avgSalary: '₹3-12 LPA'
                    }
                  }
                }
              }
            }
          },
          'Digital & IT Skills': {
            id: 'digital-it-skills',
            label: 'Digital & IT Skills',
            color: '#10B981',
            children: {
              'Computer Applications': {
                id: 'computer-applications',
                label: 'Computer Applications',
                color: '#059669',
                children: {
                  'Data Entry Operator': {
                    id: 'data-entry',
                    label: 'Data Entry Operator',
                    color: '#047857',
                    children: {
                      'Online Data Entry': {
                        id: 'online-data-entry',
                        label: 'Online Data Entry',
                        color: '#065F46',
                        details: {
                          courses: ['Computer Basics', 'MS Office', 'Typing Speed'],
                          scope: 'Freelance Data Entry, Remote Data Entry, Virtual Assistant',
                          duration: '3-6 months',
                          avgSalary: '₹2-5 LPA'
                        }
                      },
                      'Office Data Entry': {
                        id: 'office-data-entry',
                        label: 'Office Data Entry',
                        color: '#064E3B',
                        details: {
                          courses: ['MS Office', 'Database Entry', 'Accounting Software'],
                          scope: 'Office Assistant, Data Entry Clerk, Document Processor',
                          duration: '3-6 months',
                          avgSalary: '₹2-6 LPA'
                        }
                      }
                    }
                  },
                  'Web Development Basics': {
                    id: 'web-dev-basics',
                    label: 'Web Development Basics',
                    color: '#0F766E',
                    children: {
                      'Website Builder': {
                        id: 'website-builder',
                        label: 'Website Builder',
                        color: '#0D9488',
                        details: {
                          courses: ['WordPress', 'Website Building', 'Basic HTML/CSS'],
                          scope: 'WordPress Developer, Website Designer, Freelance Web Builder',
                          duration: '6-12 months',
                          avgSalary: '₹3-10 LPA'
                        }
                      },
                      'E-commerce Assistant': {
                        id: 'ecommerce-assistant',
                        label: 'E-commerce Assistant',
                        color: '#14B8A6',
                        details: {
                          courses: ['E-commerce Platforms', 'Digital Marketing', 'Product Listing'],
                          scope: 'Amazon Seller Assistant, E-commerce Manager, Online Store Manager',
                          duration: '3-6 months',
                          avgSalary: '₹2.5-8 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Service Industry Skills': {
        id: 'service-skills',
        label: 'Service Industry Skills',
        color: '#EC4899',
        children: {
          'Hospitality Services': {
            id: 'hospitality-services',
            label: 'Hospitality Services',
            color: '#DB2777',
            children: {
              'Food Service': {
                id: 'food-service',
                label: 'Food Service',
                color: '#BE185D',
                children: {
                  'Chef & Cooking': {
                    id: 'chef-cooking',
                    label: 'Chef & Cooking',
                    color: '#A21CAF',
                    children: {
                      'Professional Chef': {
                        id: 'professional-chef',
                        label: 'Professional Chef',
                        color: '#86198F',
                        details: {
                          courses: ['Culinary Arts', 'Food Production', 'Kitchen Management'],
                          scope: 'Restaurant Chef, Hotel Chef, Catering Chef, Personal Chef',
                          duration: '1-3 years',
                          avgSalary: '₹3-15 LPA'
                        }
                      },
                      'Bakery & Pastry': {
                        id: 'bakery-pastry',
                        label: 'Bakery & Pastry',
                        color: '#701A75',
                        details: {
                          courses: ['Baking & Pastry', 'Cake Decoration', 'Food Safety'],
                          scope: 'Baker, Pastry Chef, Cake Designer, Bakery Owner',
                          duration: '6-18 months',
                          avgSalary: '₹2.5-10 LPA'
                        }
                      }
                    }
                  },
                  'Hotel Operations': {
                    id: 'hotel-operations',
                    label: 'Hotel Operations',
                    color: '#EC4899',
                    children: {
                      'Front Office Executive': {
                        id: 'front-office',
                        label: 'Front Office Executive',
                        color: '#DB2777',
                        details: {
                          courses: ['Hotel Management', 'Customer Service', 'Front Office Operations'],
                          scope: 'Receptionist, Guest Relations, Concierge, Hotel Supervisor',
                          duration: '6-12 months',
                          avgSalary: '₹2.5-8 LPA'
                        }
                      },
                      'Housekeeping Supervisor': {
                        id: 'housekeeping',
                        label: 'Housekeeping Supervisor',
                        color: '#BE185D',
                        details: {
                          courses: ['Housekeeping Operations', 'Hygiene Standards', 'Team Management'],
                          scope: 'Housekeeping Manager, Room Attendant, Laundry Supervisor',
                          duration: '3-6 months',
                          avgSalary: '₹2-6 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Personal Care Services': {
            id: 'personal-care',
            label: 'Personal Care Services',
            color: '#F472B6',
            children: {
              'Beauty & Wellness': {
                id: 'beauty-wellness',
                label: 'Beauty & Wellness',
                color: '#EC4899',
                children: {
                  'Hair Styling': {
                    id: 'hair-styling',
                    label: 'Hair Styling',
                    color: '#DB2777',
                    children: {
                      'Professional Hair Stylist': {
                        id: 'hair-stylist',
                        label: 'Professional Hair Stylist',
                        color: '#BE185D',
                        details: {
                          courses: ['Hair Styling', 'Hair Cutting', 'Hair Coloring', 'Salon Management'],
                          scope: 'Hair Stylist, Salon Owner, Freelance Stylist, Bridal Stylist',
                          duration: '6-12 months',
                          avgSalary: '₹2-8 LPA'
                        }
                      },
                      'Hair Colorist': {
                        id: 'hair-colorist',
                        label: 'Hair Colorist',
                        color: '#A21CAF',
                        details: {
                          courses: ['Hair Coloring Techniques', 'Color Theory', 'Chemical Treatments'],
                          scope: 'Color Specialist, Salon Colorist, Hair Treatment Expert',
                          duration: '3-6 months',
                          avgSalary: '₹2.5-10 LPA'
                        }
                      }
                    }
                  },
                  'Skin Care & Beauty': {
                    id: 'skin-care',
                    label: 'Skin Care & Beauty',
                    color: '#F472B6',
                    children: {
                      'Beauty Therapist': {
                        id: 'beauty-therapist',
                        label: 'Beauty Therapist',
                        color: '#EC4899',
                        details: {
                          courses: ['Cosmetology', 'Facial Treatments', 'Skin Care'],
                          scope: 'Beauty Therapist, Facial Specialist, Spa Therapist',
                          duration: '6-12 months',
                          avgSalary: '₹2-7 LPA'
                        }
                      },
                      'Makeup Artist': {
                        id: 'makeup-artist',
                        label: 'Makeup Artist',
                        color: '#DB2777',
                        details: {
                          courses: ['Professional Makeup', 'Bridal Makeup', 'Special Effects Makeup'],
                          scope: 'Bridal Makeup Artist, Fashion Makeup Artist, Freelance MUA',
                          duration: '3-8 months',
                          avgSalary: '₹3-15 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  Diploma: {
    id: 'diploma',
    label: 'Diploma & Polytechnic',
    color: '#0891B2',
    children: {
      'Engineering Diplomas': {
        id: 'engineering-diploma',
        label: 'Engineering Diplomas',
        color: '#1D4ED8',
        children: {
          'Computer Science & IT': {
            id: 'cs-diploma',
            label: 'Computer Science & IT',
            color: '#10B981',
            children: {
              'Software Development': {
                id: 'software-dev-diploma',
                label: 'Software Development',
                color: '#059669',
                children: {
                  'Web Development Diploma': {
                    id: 'web-dev-diploma',
                    label: 'Web Development',
                    color: '#047857',
                    details: {
                      courses: ['Diploma in Computer Science', 'Web Technology', 'Database Management'],
                      scope: 'Junior Web Developer, Frontend Developer, Web Designer',
                      duration: '3 years',
                      avgSalary: '₹2.5-8 LPA'
                    }
                  },
                  'Mobile App Development': {
                    id: 'mobile-dev-diploma',
                    label: 'Mobile App Development',
                    color: '#065F46',
                    details: {
                      courses: ['Mobile Application Development', 'Android Development', 'Java Programming'],
                      scope: 'Junior Mobile Developer, App Developer, Android Developer',
                      duration: '3 years',
                      avgSalary: '₹3-10 LPA'
                    }
                  },
                  'System Administration': {
                    id: 'system-admin-diploma',
                    label: 'System Administration',
                    color: '#064E3B',
                    details: {
                      courses: ['System Administration', 'Network Management', 'Server Management'],
                      scope: 'System Administrator, Network Technician, IT Support',
                      duration: '3 years',
                      avgSalary: '₹3-9 LPA'
                    }
                  }
                }
              },
              'Hardware & Networking': {
                id: 'hardware-networking-diploma',
                label: 'Hardware & Networking',
                color: '#10B981',
                children: {
                  'Computer Hardware': {
                    id: 'hardware-diploma',
                    label: 'Computer Hardware',
                    color: '#059669',
                    details: {
                      courses: ['Computer Hardware', 'Motherboard Repair', 'Component Assembly'],
                      scope: 'Hardware Technician, Computer Repair, Service Center',
                      duration: '2-3 years',
                      avgSalary: '₹2-7 LPA'
                    }
                  },
                  'Network Administration': {
                    id: 'network-admin-diploma',
                    label: 'Network Administration',
                    color: '#047857',
                    details: {
                      courses: ['Networking', 'CCNA', 'Network Security'],
                      scope: 'Network Administrator, IT Support, Network Engineer',
                      duration: '3 years',
                      avgSalary: '₹3-10 LPA'
                    }
                  }
                }
              }
            }
          },
          'Mechanical Engineering': {
            id: 'mech-diploma',
            label: 'Mechanical Engineering',
            color: '#F59E0B',
            children: {
              'Production Technology': {
                id: 'production-tech-diploma',
                label: 'Production Technology',
                color: '#D97706',
                children: {
                  'Manufacturing Processes': {
                    id: 'manufacturing-diploma',
                    label: 'Manufacturing Processes',
                    color: '#B45309',
                    children: {
                      'CNC Operator': {
                        id: 'cnc-operator-diploma',
                        label: 'CNC Operator',
                        color: '#92400E',
                        details: {
                          courses: ['Mechanical Engineering Diploma', 'CNC Programming', 'Machine Operations'],
                          scope: 'CNC Machine Operator, Production Supervisor, Quality Inspector',
                          duration: '3 years',
                          avgSalary: '₹3-8 LPA'
                        }
                      },
                      'Quality Control Inspector': {
                        id: 'qc-inspector-diploma',
                        label: 'Quality Control Inspector',
                        color: '#78350F',
                        details: {
                          courses: ['Quality Control', 'Metrology', 'Manufacturing Processes'],
                          scope: 'QC Inspector, Quality Analyst, Production Controller',
                          duration: '3 years',
                          avgSalary: '₹2.5-7 LPA'
                        }
                      },
                      'Production Supervisor': {
                        id: 'production-supervisor-diploma',
                        label: 'Production Supervisor',
                        color: '#451A03',
                        details: {
                          courses: ['Production Management', 'Industrial Engineering', 'Team Leadership'],
                          scope: 'Production Supervisor, Floor Manager, Operations Executive',
                          duration: '3-4 years',
                          avgSalary: '₹4-10 LPA'
                        }
                      }
                    }
                  },
                  'Maintenance Engineering': {
                    id: 'maintenance-diploma',
                    label: 'Maintenance Engineering',
                    color: '#F59E0B',
                    children: {
                      'Industrial Maintenance': {
                        id: 'industrial-maintenance-diploma',
                        label: 'Industrial Maintenance',
                        color: '#D97706',
                        details: {
                          courses: ['Mechanical Maintenance', 'Hydraulics', 'Pneumatics'],
                          scope: 'Maintenance Engineer, Equipment Technician, Plant Maintenance',
                          duration: '3 years',
                          avgSalary: '₹3-9 LPA'
                        }
                      },
                      'Automotive Maintenance': {
                        id: 'auto-maintenance-diploma',
                        label: 'Automotive Maintenance',
                        color: '#B45309',
                        details: {
                          courses: ['Automotive Technology', 'Engine Systems', 'Electrical Systems'],
                          scope: 'Automotive Technician, Service Advisor, Workshop Supervisor',
                          duration: '3 years',
                          avgSalary: '₹3-8 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Civil Engineering': {
            id: 'civil-diploma',
            label: 'Civil Engineering',
            color: '#EF4444',
            children: {
              'Construction Technology': {
                id: 'construction-tech-diploma',
                label: 'Construction Technology',
                color: '#DC2626',
                children: {
                  'Building Construction': {
                    id: 'building-construction-diploma',
                    label: 'Building Construction',
                    color: '#B91C1C',
                    children: {
                      'Site Supervisor': {
                        id: 'site-supervisor-diploma',
                        label: 'Site Supervisor',
                        color: '#991B1B',
                        details: {
                          courses: ['Civil Engineering Diploma', 'Construction Management', 'Building Codes'],
                          scope: 'Construction Supervisor, Site Engineer, Project Coordinator',
                          duration: '3 years',
                          avgSalary: '₹3-8 LPA'
                        }
                      },
                      'Quantity Surveyor': {
                        id: 'quantity-surveyor-diploma',
                        label: 'Quantity Surveyor',
                        color: '#7F1D1D',
                        details: {
                          courses: ['Quantity Surveying', 'Cost Estimation', 'Project Management'],
                          scope: 'Quantity Surveyor, Cost Estimator, Construction Consultant',
                          duration: '3 years',
                          avgSalary: '₹4-10 LPA'
                        }
                      },
                      'Construction Manager': {
                        id: 'construction-manager-diploma',
                        label: 'Construction Manager',
                        color: '#450A0A',
                        details: {
                          courses: ['Construction Management', 'Project Planning', 'Safety Management'],
                          scope: 'Construction Manager, Project Manager, Site Manager',
                          duration: '3-4 years',
                          avgSalary: '₹5-12 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Medical & Healthcare Diplomas': {
        id: 'medical-diploma',
        label: 'Medical & Healthcare',
        color: '#EC4899',
        children: {
          'Pharmacy': {
            id: 'pharmacy-diploma',
            label: 'Pharmacy (D.Pharm)',
            color: '#059669',
            children: {
              'Community Pharmacy': {
                id: 'community-pharmacy',
                label: 'Community Pharmacy',
                color: '#047857',
                children: {
                  'Retail Pharmacist': {
                    id: 'retail-pharmacist',
                    label: 'Retail Pharmacist',
                    color: '#065F46',
                    children: {
                      'Independent Pharmacy Owner': {
                        id: 'pharmacy-owner',
                        label: 'Pharmacy Owner',
                        color: '#064E3B',
                        details: {
                          courses: ['D.Pharm', 'Pharmacy Management', 'Drug Store License'],
                          scope: 'Pharmacy Owner, Medical Store Owner, Franchise Pharmacist',
                          duration: '2-3 years',
                          avgSalary: '₹4-15 LPA'
                        }
                      },
                      'Chain Pharmacy Pharmacist': {
                        id: 'chain-pharmacist',
                        label: 'Chain Pharmacy Pharmacist',
                        color: '#052E16',
                        details: {
                          courses: ['D.Pharm', 'Pharmaceutical Care', 'Customer Service'],
                          scope: 'Apollo Pharmacy, Medicine Shoppe, Chain Store Pharmacist',
                          duration: '2 years',
                          avgSalary: '₹3-8 LPA'
                        }
                      }
                    }
                  },
                  'Clinical Support': {
                    id: 'clinical-support-pharmacy',
                    label: 'Clinical Support',
                    color: '#059669',
                    children: {
                      'Hospital Pharmacist': {
                        id: 'hospital-pharmacist',
                        label: 'Hospital Pharmacist',
                        color: '#047857',
                        details: {
                          courses: ['D.Pharm', 'Hospital Pharmacy', 'Clinical Pharmacy'],
                          scope: 'Hospital Pharmacist, In-patient Pharmacy, Emergency Pharmacy',
                          duration: '2-3 years',
                          avgSalary: '₹3-7 LPA'
                        }
                      },
                      'Medical Representative': {
                        id: 'medical-rep',
                        label: 'Medical Representative',
                        color: '#065F46',
                        details: {
                          courses: ['D.Pharm', 'Medical Marketing', 'Product Knowledge'],
                          scope: 'Pharmaceutical Sales, Medical Rep, Product Specialist',
                          duration: '2-3 years',
                          avgSalary: '₹4-12 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Medical Laboratory Technology': {
            id: 'medical-lab-diploma',
            label: 'Medical Lab Technology',
            color: '#DC2626',
            children: {
              'Diagnostic Services': {
                id: 'diagnostic-services',
                label: 'Diagnostic Services',
                color: '#B91C1C',
                children: {
                  'Clinical Laboratory': {
                    id: 'clinical-lab',
                    label: 'Clinical Laboratory',
                    color: '#991B1B',
                    children: {
                      'Lab Technician': {
                        id: 'lab-technician',
                        label: 'Lab Technician',
                        color: '#7F1D1D',
                        details: {
                          courses: ['DMLT', 'Clinical Pathology', 'Microbiology'],
                          scope: 'Pathology Lab Technician, Hospital Lab, Diagnostic Center',
                          duration: '2 years',
                          avgSalary: '₹2.5-6 LPA'
                        }
                      },
                      'Microbiology Technician': {
                        id: 'microbiology-tech',
                        label: 'Microbiology Technician',
                        color: '#450A0A',
                        details: {
                          courses: ['DMLT', 'Microbiology', 'Bacteriology'],
                          scope: 'Microbiology Lab, Research Lab, Quality Control Lab',
                          duration: '2-3 years',
                          avgSalary: '₹3-7 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Nursing': {
            id: 'nursing-diploma',
            label: 'General Nursing (GNM)',
            color: '#7C2D12',
            children: {
              'Clinical Nursing': {
                id: 'clinical-nursing',
                label: 'Clinical Nursing',
                color: '#92400E',
                children: {
                  'Ward Nursing': {
                    id: 'ward-nursing',
                    label: 'Ward Nursing',
                    color: '#78350F',
                    children: {
                      'Staff Nurse': {
                        id: 'staff-nurse',
                        label: 'Staff Nurse',
                        color: '#451A03',
                        details: {
                          courses: ['GNM', 'Patient Care', 'Medical Procedures'],
                          scope: 'Hospital Staff Nurse, Ward Nurse, ICU Nurse',
                          duration: '3.5 years',
                          avgSalary: '₹3-7 LPA'
                        }
                      },
                      'Private Duty Nurse': {
                        id: 'private-nurse',
                        label: 'Private Duty Nurse',
                        color: '#1C0B02',
                        details: {
                          courses: ['GNM', 'Home Care', 'Patient Management'],
                          scope: 'Private Nurse, Home Care Nurse, Elder Care Nurse',
                          duration: '3.5 years',
                          avgSalary: '₹4-10 LPA'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Custom node component
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const { label, color, onClick, isExpanded, level, hasChildren, isRootNode } = data;
  
  // Special rendering for root node
  if (isRootNode) {
    return (
      <div 
        className="px-6 py-4 rounded-full border-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 border-white"
        style={{ minWidth: '160px', color: 'white' }}
        onClick={onClick}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">👨‍💻</div>
          <div className="font-bold text-lg leading-tight">{label}</div>
        </div>
        
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      </div>
    );
  }
  
  return (
    <div 
      className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        level === 0 ? 'min-w-[120px]' : level === 1 ? 'min-w-[100px]' : level === 2 ? 'min-w-[140px] max-w-[180px]' : 'min-w-[120px] max-w-[160px]'
      }`}
      style={{ 
        backgroundColor: color,
        borderColor: color,
        color: 'white',
        fontSize: level === 0 ? '16px' : level === 1 ? '14px' : level === 2 ? '11px' : '10px'
      }}
      onClick={onClick}
    >
      <div className="text-center font-semibold leading-tight">
        {level >= 2 ? (
          <div className="break-words">{label}</div>
        ) : (
          label
        )}
      </div>
      {hasChildren && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center justify-center w-5 h-5 bg-white text-black rounded-full font-bold text-sm shadow-md">
            {isExpanded ? '−' : '+'}
          </div>
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode
};

interface AskBotProps {
  currentPath: string[];
  selectedNodeData: any;
}

const AskBot = React.forwardRef<{ askAboutCareer: (careerData: any) => void }, AskBotProps>(({ currentPath, selectedNodeData }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useImperativeHandle(ref, () => ({
    askAboutCareer: (careerData: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      setInputMessage(`Tell me about ${careerData.label} career path`);
      // Auto-send the question
      setTimeout(() => {
        handleAutoQuestion(careerData);
      }, 500);
    }
  }));

  const handleAutoQuestion = async (careerData: any) => {
    const autoQuestion = `Tell me about ${careerData.label} career path`;
    setMessages(prev => [...prev, { type: 'user', content: autoQuestion }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `You are an Indian career guidance AI assistant specializing in the Indian job market, education system, and career landscape. The student is asking about: "${careerData.label}".

Career Details:
- Courses: ${careerData.details?.courses?.join(', ')}
- Scope: ${careerData.details?.scope}
- Duration: ${careerData.details?.duration}
- Average Salary: ${careerData.details?.avgSalary}

Student Question: ${autoQuestion}

Please provide exactly 8 short, actionable points (each point should be 1-2 sentences max) specifically for the INDIAN context covering:
1. Key skills needed in Indian companies/startups
2. Best preparation strategies for Indian job market
3. Important Indian exams/certifications (like GATE, JEE, etc.)
4. Career growth prospects in India's tech hubs (Bangalore, Hyderabad, Pune, etc.)
5. Current Indian industry trends and government initiatives (Digital India, Make in India, etc.)
6. Salary expectations in Indian companies (TCS, Infosys, Wipro, startups, MNCs)
7. Networking tips for Indian professionals (LinkedIn India, local meetups, college alumni)
8. Alternative career paths within India's growing sectors

Focus on Indian companies, Indian education system, Indian government schemes, and opportunities specifically available in India. Mention INR salary ranges and Indian cities/regions where relevant.`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { type: 'bot', content: data.message || data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextualPrompt = () => {
    if (selectedNodeData && selectedNodeData.details) {
      return `You are an Indian career guidance AI assistant specializing in the Indian job market, education system, and career landscape. The student is currently exploring the career path: "${selectedNodeData.label}". 

Career Details:
- Courses: ${selectedNodeData.details.courses?.join(', ')}
- Scope: ${selectedNodeData.details.scope}
- Duration: ${selectedNodeData.details.duration}
- Average Salary: ${selectedNodeData.details.avgSalary}

Provide helpful career guidance specifically for the INDIAN context in exactly 8 short, actionable points. Focus on Indian opportunities, companies, education system, and market trends.`;
    } else if (currentPath.length > 0) {
      return `You are an Indian career guidance AI assistant specializing in the Indian job market and education system. The student is currently exploring the career path: ${currentPath.join(' → ')}. Provide helpful career guidance specifically for the INDIAN context in exactly 8 short, actionable points about this career path. Focus on Indian opportunities, companies, education system, and market trends.`;
    } else {
      return `You are an Indian career guidance AI assistant specializing in the Indian job market, education system, and career landscape. The student is exploring career options in India. Provide helpful career guidance specifically for the INDIAN context in exactly 8 short, actionable points. Focus on Indian opportunities, companies, education system, and market trends.`;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `${getContextualPrompt()}

Student Question: ${userMessage}

Please provide exactly 8 short, actionable points (each point should be 1-2 sentences max) specifically for the INDIAN context covering:
1. Key skills needed in Indian companies/startups
2. Best preparation strategies for Indian job market
3. Important Indian exams/certifications (like GATE, JEE, CAT, etc.)
4. Career growth prospects in India's tech hubs (Bangalore, Hyderabad, Pune, Mumbai, etc.)
5. Current Indian industry trends and government initiatives (Digital India, Startup India, etc.)
6. Salary expectations in Indian companies (Indian startups, MNCs in India, service companies)
7. Networking tips for Indian professionals (Indian LinkedIn groups, local meetups, alumni networks)
8. Alternative career paths within India's growing sectors

Focus on Indian companies, Indian education system, Indian government schemes, and opportunities specifically available in India. Mention INR salary ranges and Indian cities/regions where relevant.`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { type: 'bot', content: data.message || data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          <Bot className="w-6 h-6" />
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">Career Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-80 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Bot className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Career Guidance Assistant</p>
                <p className="text-xs mt-1">Ask me about careers, exams, future prospects!</p>
                {currentPath.length > 0 && (
                  <p className="text-xs mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    Currently exploring: <span className="font-medium">{currentPath.join(' → ')}</span>
                  </p>
                )}
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  {message.content.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-900 dark:text-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about careers, exams, future prospects..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AskBot.displayName = 'AskBot';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onAskAI: (careerData: any) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, onAskAI }) => {
  if (!isOpen || !data || !data.details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {data.label}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskAI(data)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
              title="Ask AI about this career"
            >
              <Bot className="w-4 h-4" />
              Ask AI
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Courses:</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              {data.details.courses.map((course: string, index: number) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Career Scope:</h4>
            <p className="text-gray-600 dark:text-gray-300">{data.details.scope}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Duration:</h4>
            <p className="text-gray-600 dark:text-gray-300">{data.details.duration}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Average Salary:</h4>
            <p className="text-gray-600 dark:text-gray-300">{data.details.avgSalary}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CourseMapping: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([
    'career-hub' // Only expand the root node
  ])); // Start with only root node expanded
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const askBotRef = React.useRef<{ askAboutCareer: (careerData: any) => void }>(null);
  const [badgeNotification, setBadgeNotification] = useState<{badge: any, isVisible: boolean}>({badge: null, isVisible: false});
  const [hasTriggeredCareerBadge, setHasTriggeredCareerBadge] = useState(false);

  // Trigger career mapping badge on first node click
  const triggerCareerMappingBadge = async () => {
    if (hasTriggeredCareerBadge) return;
    
    console.log('🗺️ Triggering career mapping badge...');
    try {
      const result = await badgeService.triggerCareerMappingBadge();
      console.log('🗺️ Badge service result:', result);
      if (result?.isNewBadge && result.badge) {
        console.log('🎉 New career badge earned! Showing notification:', result.badge);
        setBadgeNotification({ badge: result.badge, isVisible: true });
        setHasTriggeredCareerBadge(true);
      } else {
        console.log('🔔 No new career badge or badge already earned');
      }
    } catch (error) {
      console.error('❌ Failed to trigger career mapping badge:', error);
    }
  };

  const handleAskAI = (careerData: any) => {
    if (askBotRef.current) {
      askBotRef.current.askAboutCareer(careerData);
    }
  };

  // Generate nodes and edges based on expanded state
  const generateFlowData = useCallback(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Add central root node
    const rootY = -200;
    const totalStreams = Object.keys(careerData).length;
    const rootX = (totalStreams - 1) * 400 / 2; // Center the root node horizontally
    
    newNodes.push({
      id: 'career-hub',
      type: 'custom',
      position: { x: rootX, y: rootY },
      data: {
        label: 'Career Explorer',
        color: '#6366F1',
        level: -1,
        hasChildren: true,
        isExpanded: true,
        isRootNode: true,
        onClick: () => {}
      }
    });
    
    let yOffset = 100; // Position main streams below root
    const streamSpacing = 400; // Increased spacing for better visibility
    
    Object.entries(careerData).forEach(([streamKey, streamData], streamIndex) => {
      const streamX = streamIndex * streamSpacing;
      
      // Add main stream node
      newNodes.push({
        id: streamData.id,
        type: 'custom',
        position: { x: streamX, y: yOffset },
        data: {
          label: streamData.label,
          color: streamData.color,
          level: 0,
          hasChildren: !!streamData.children,
          isExpanded: expandedNodes.has(streamData.id),
          onClick: () => {
            // Trigger career mapping badge on first node click
            triggerCareerMappingBadge();
            toggleExpand(streamData.id);
          }
        }
      });
      
      // Add edge from root to stream
      newEdges.push({
        id: `career-hub-${streamData.id}`,
        source: 'career-hub',
        target: streamData.id,
        animated: true,
        style: { stroke: streamData.color, strokeWidth: 3 }
      });
      
      if (expandedNodes.has(streamData.id) && streamData.children) {
        let categoryY = yOffset + 180; // Increased vertical spacing
        
        Object.entries(streamData.children).forEach(([categoryKey, categoryData], categoryIndex) => {
          const categoryX = streamX + (categoryIndex - Object.keys(streamData.children!).length / 2 + 0.5) * 250; // Increased horizontal spacing
          
          // Add category node
          newNodes.push({
            id: categoryData.id,
            type: 'custom',
            position: { x: categoryX, y: categoryY },
            data: {
              label: categoryData.label,
              color: categoryData.color,
              level: 1,
              hasChildren: !!categoryData.children,
              isExpanded: expandedNodes.has(categoryData.id),
              onClick: () => {
                // Trigger career mapping badge on first node click
                triggerCareerMappingBadge();
                // Priority: if has children, expand/collapse; if no children, show modal
                if (categoryData.children) {
                  toggleExpand(categoryData.id);
                } else if (categoryData.details) {
                  openModal(categoryData);
                }
              }
            }
          });
          
          // Add edge from stream to category
          newEdges.push({
            id: `${streamData.id}-${categoryData.id}`,
            source: streamData.id,
            target: categoryData.id,
            animated: true,
            style: { stroke: categoryData.color }
          });
          
          if (expandedNodes.has(categoryData.id) && categoryData.children) {
            let careerY = categoryY + 180; // Increased vertical spacing for career nodes
            
            Object.entries(categoryData.children).forEach(([careerKey, careerData], careerIndex) => {
              const careerX = categoryX + (careerIndex - Object.keys(categoryData.children!).length / 2 + 0.5) * 180; // Reduced spacing for 5 nodes to fit better
              
              // Add career node (3rd level)
              newNodes.push({
                id: careerData.id,
                type: 'custom',
                position: { x: careerX, y: careerY },
                data: {
                  label: careerData.label,
                  color: careerData.color,
                  level: 2,
                  hasChildren: !!careerData.children,
                  isExpanded: expandedNodes.has(careerData.id),
                  onClick: () => {
                    if (careerData.children) {
                      toggleExpand(careerData.id);
                    } else if (careerData.details) {
                      openModal(careerData);
                    }
                  }
                }
              });
              
              // Add edge from category to career
              newEdges.push({
                id: `${categoryData.id}-${careerData.id}`,
                source: categoryData.id,
                target: careerData.id,
                animated: true,
                style: { stroke: careerData.color }
              });
              
              // Add 4th level specializations
              if (expandedNodes.has(careerData.id) && careerData.children) {
                let specializationY = careerY + 180;
                
                Object.entries(careerData.children).forEach(([specKey, specData], specIndex) => {
                  const specX = careerX + (specIndex - Object.keys(careerData.children!).length / 2 + 0.5) * 160;
                  
                  // Add specialization node (4th level)
                  newNodes.push({
                    id: specData.id,
                    type: 'custom',
                    position: { x: specX, y: specializationY },
                    data: {
                      label: specData.label,
                      color: specData.color,
                      level: 3,
                      hasChildren: !!specData.children,
                      isExpanded: expandedNodes.has(specData.id),
                      onClick: () => {
                        if (specData.children) {
                          toggleExpand(specData.id);
                        } else if (specData.details) {
                          openModal(specData);
                        }
                      }
                    }
                  });
                  
                  // Add edge from career to specialization
                  newEdges.push({
                    id: `${careerData.id}-${specData.id}`,
                    source: careerData.id,
                    target: specData.id,
                    animated: true,
                    style: { stroke: specData.color }
                  });
                  
                  // Add 5th level sub-specializations
                  if (expandedNodes.has(specData.id) && specData.children) {
                    let subSpecY = specializationY + 180;
                    
                    Object.entries(specData.children).forEach(([subSpecKey, subSpecData], subSpecIndex) => {
                      const subSpecX = specX + (subSpecIndex - Object.keys(specData.children!).length / 2 + 0.5) * 140;
                      
                      // Add sub-specialization node (5th level)
                      newNodes.push({
                        id: subSpecData.id,
                        type: 'custom',
                        position: { x: subSpecX, y: subSpecY },
                        data: {
                          label: subSpecData.label,
                          color: subSpecData.color,
                          level: 4,
                          hasChildren: !!subSpecData.children,
                          isExpanded: expandedNodes.has(subSpecData.id),
                          onClick: () => {
                            if (subSpecData.children) {
                              toggleExpand(subSpecData.id);
                            } else if (subSpecData.details) {
                              openModal(subSpecData);
                            }
                          }
                        }
                      });
                      
                      // Add edge from specialization to sub-specialization
                      newEdges.push({
                        id: `${specData.id}-${subSpecData.id}`,
                        source: specData.id,
                        target: subSpecData.id,
                        animated: true,
                        style: { stroke: subSpecData.color }
                      });
                      
                      // Add 6th level career paths
                      if (expandedNodes.has(subSpecData.id) && subSpecData.children) {
                        let careerPathY = subSpecY + 180;
                        
                        Object.entries(subSpecData.children).forEach(([careerPathKey, careerPathData], careerPathIndex) => {
                          const careerPathX = subSpecX + (careerPathIndex - Object.keys(subSpecData.children!).length / 2 + 0.5) * 120;
                          
                          // Add career path node (6th level)
                          newNodes.push({
                            id: careerPathData.id,
                            type: 'custom',
                            position: { x: careerPathX, y: careerPathY },
                            data: {
                              label: careerPathData.label,
                              color: careerPathData.color,
                              level: 5,
                              hasChildren: !!careerPathData.children,
                              isExpanded: expandedNodes.has(careerPathData.id),
                              onClick: () => {
                                if (careerPathData.children) {
                                  toggleExpand(careerPathData.id);
                                } else if (careerPathData.details) {
                                  openModal(careerPathData);
                                }
                              }
                            }
                          });
                          
                          // Add edge from sub-specialization to career path
                          newEdges.push({
                            id: `${subSpecData.id}-${careerPathData.id}`,
                            source: subSpecData.id,
                            target: careerPathData.id,
                            animated: true,
                            style: { stroke: careerPathData.color }
                          });
                          
                          // Add 7th level final career specializations
                          if (expandedNodes.has(careerPathData.id) && careerPathData.children) {
                            let finalCareerY = careerPathY + 180;
                            
                            Object.entries(careerPathData.children).forEach(([finalCareerKey, finalCareerData], finalCareerIndex) => {
                              const finalCareerX = careerPathX + (finalCareerIndex - Object.keys(careerPathData.children!).length / 2 + 0.5) * 100;
                              
                              // Add final career node (7th level)
                              newNodes.push({
                                id: finalCareerData.id,
                                type: 'custom',
                                position: { x: finalCareerX, y: finalCareerY },
                                data: {
                                  label: finalCareerData.label,
                                  color: finalCareerData.color,
                                  level: 6,
                                  hasChildren: false,
                                  isExpanded: false,
                                  onClick: () => openModal(finalCareerData)
                                }
                              });
                              
                              // Add edge from career path to final career
                              newEdges.push({
                                id: `${careerPathData.id}-${finalCareerData.id}`,
                                source: careerPathData.id,
                                target: finalCareerData.id,
                                animated: true,
                                style: { stroke: finalCareerData.color }
                              });
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [expandedNodes]);

  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        // Collapsing - remove this node and all its descendants
        newSet.delete(nodeId);
        
        // Helper function to recursively find and remove all descendants
        const removeDescendants = (parentId: string, data: any) => {
          Object.values(data).forEach((stream: any) => {
            if (stream.id === parentId && stream.children) {
              Object.values(stream.children).forEach((category: any) => {
                newSet.delete(category.id);
                if (category.children) {
                  Object.values(category.children).forEach((career: any) => {
                    newSet.delete(career.id);
                  });
                }
              });
            } else if (stream.children) {
              Object.values(stream.children).forEach((category: any) => {
                if (category.id === parentId && category.children) {
                  Object.values(category.children).forEach((career: any) => {
                    newSet.delete(career.id);
                  });
                }
              });
            }
          });
        };
        
        removeDescendants(nodeId, careerData);
      } else {
        // Expanding - add this node
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const openModal = useCallback((data: any) => {
    setSelectedNodeData(data);
    setModalOpen(true);
    // Build current path for contextual bot assistance
    const path = buildPathToNode(data.id);
    setCurrentPath(path);
  }, []);

  const buildPathToNode = (nodeId: string): string[] => {
    const path: string[] = [];
    
    // Helper function to traverse career data and build path
    const findPath = (data: any, targetId: string, currentPath: string[]): boolean => {
      for (const [key, item] of Object.entries(data)) {
        const currentItem = item as CareerNode;
        const newPath = [...currentPath, currentItem.label];
        
        if (currentItem.id === targetId) {
          path.push(...newPath);
          return true;
        }
        
        if (currentItem.children && findPath(currentItem.children, targetId, newPath)) {
          return true;
        }
      }
      return false;
    };
    
    findPath(careerData, nodeId, []);
    return path;
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedNodeData(null);
  }, []);

  // Generate flow data when expanded nodes change
  React.useEffect(() => {
    generateFlowData();
  }, [generateFlowData]);

  return (
    <div className="h-screen w-full">

      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          style={{
            height: 120,
          }}
          zoomable
          pannable
        />
      </ReactFlow>
      
      <DetailModal
        isOpen={modalOpen}
        onClose={closeModal}
        data={selectedNodeData}
        onAskAI={handleAskAI}
      />
      
      <AskBot 
        ref={askBotRef}
        currentPath={currentPath}
        selectedNodeData={selectedNodeData}
      />
      
      <BadgeNotification
        badge={badgeNotification.badge}
        isVisible={badgeNotification.isVisible}
        onClose={() => setBadgeNotification({badge: null, isVisible: false})}
      />
    </div>
  );
};

export default CourseMapping;


