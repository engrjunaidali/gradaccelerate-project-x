import { Head, Link, usePage } from '@inertiajs/react'
import WeatherWidget from '../components/WeatherWidget.js'
import { Button } from "../../inertia/components/ui.js/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../inertia/components/ui.js/card"
import { BellIcon, CalendarIcon, ClockIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { ReminderStatusColors } from "../constants/ReminderStatusColors.js"
import { MailIcon } from 'lucide-react'
import ReminderNotification from '../components/ReminderNotification.js'
import { formatReminderDateTime } from '../utils/reminder-utils.js'


interface User {
  id: number
  email: string
  fullName: string
}
interface Reminder {
  id: number
  title: string
  description: string | null
  reminderDateTime: string
  status: string
  isEmailNotification: boolean
  isBrowserNotification: boolean
}

interface HomeProps {
  user?: User
  upcomingReminders?: Reminder[]
  upcomingRemindersCount?: number
  [key: string]: any
}

export default function Home() {

  const { user, upcomingReminders = [] } = usePage<HomeProps>().props

  return (
    <>
      <Head title="Race Track" />

      {/* Add notification component for logged-in users */}
      {user && <ReminderNotification userId={user.id} />}

      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-6xl mx-auto pb-6 px-6">
          <div className="flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-row items-center justify-center gap-4">
              {/* Logo */}
              <svg width="150" height="150" viewBox="0 0 2048 2048" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <path d="M1112.56 742.52C1137.5 742.52 1168.43 741.731 1193.36 741.291L1248.05 740.343C1257.56 740.227 1267.48 739.521 1276.9 740.556C1276.86 742.975 1275.19 744.317 1273.75 746.208C1250.55 783.615 1224.05 819.706 1199.22 856.096C1190.25 869.248 1180.23 882.315 1172.24 896.065C1174.23 897.375 1175.91 897.48 1178.21 897.805C1185.53 895.218 1259.91 896.217 1272.37 896.941L1256.73 918.041L1170.55 1031.62C1163.56 1040.83 1149.38 1062.73 1141.85 1069.25L1134.6 1079.14C1131.29 1083.43 1128.09 1088.24 1124.28 1092.08C1101.5 1125 1085.6 1143 1064.23 1177.8C1055.17 1189.46 1035.6 1222.03 1023 1228.5C1021.25 1229.4 1017.53 1228.04 1016.4 1226.69C1014.66 1224.61 1014.82 1221.64 1015.39 1219.16C1016.37 1214.89 1018.39 1211.21 1019.88 1207.13C1046.58 1133.39 1076.8 1058.1 1108.39 986.207C1098.51 986.163 1088.63 986.065 1078.75 985.911C1061.44 986.55 1043.93 986.031 1026.59 986.032C1030.54 952.504 1099.5 777 1112.56 742.52Z" fill="url(#paint0_linear_44689_2672)" />
                <defs>
                  <linearGradient id="paint0_linear_44689_2672" x1="825.5" y1="1031" x2="1047.79" y2="779.83" gradientUnits="userSpaceOnUse">
                    <stop offset="0.035" stopColor="#FFB30F" />
                    <stop offset="0.505" stopColor="#FFBA06" />
                    <stop offset="1" stopColor="#D73E47" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">
                  {user ? `Welcome back, ${user.fullName.split(' ')[0]}!` : 'Welcome to Race Track'}

                </h1>
                {user && (
                  <div className="flex items-center justify-center gap-4 text-[#98989D]">
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} />
                      <span>{user.email}</span>
                    </div>
                    <Link
                      href="/auth/session/logout"
                      method="post"
                      className="flex items-center gap-2 text-[#FF453A] hover:text-[#FF6B6B] transition-colors"
                    >
                      <LogOutIcon size={16} />
                      <span>Logout</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Content for Authenticated Users */}
            {user && (
              <div className="space-y-8">

                {/* Top Row - Weather Widget and Upcoming Reminders (50/50 split) */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">

                  {/* Left Half - Weather Widget */}
                  <div>
                    <WeatherWidget className='h-full' />
                  </div>

                  {/* Right Half - Upcoming Reminders */}
                  <div>
                    <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-xl flex items-center gap-2">
                            <BellIcon size={24} className={`${ReminderStatusColors['pending']}`} />
                            Upcoming Reminders
                          </CardTitle>
                          <Link
                            href="/reminders"
                            className={`${ReminderStatusColors['pending']} hover:text-white text-sm transition-colors`}
                          >
                            View all →
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {upcomingReminders.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingReminders.map((reminder) => (
                              <div
                                key={reminder.id}
                                className="flex items-start gap-4 p-4 bg-[#3A3A3C] rounded-lg hover:bg-[#404042] transition-colors"
                              >
                                <div className="p-2 bg-[#0A84FF]/10 rounded-lg">
                                  <CalendarIcon size={20} className={`${ReminderStatusColors['pending']}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-white truncate">{reminder.title}</h3>
                                  {reminder.description && (
                                    <p className="text-[#98989D] text-sm mt-1 line-clamp-2">{reminder.description}</p>
                                  )}


                                  <div className="flex items-center gap-4 my-2 text-sm text-[#98989D]">
                                    <div className="flex items-center gap-1">
                                      <ClockIcon size={14} />
                                      <span>{formatReminderDateTime(reminder.reminderDateTime)}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <MailIcon size={14} className={reminder.isEmailNotification ? 'text-[#0A84FF]' : 'text-[#98989D]'} />
                                      <span>Email</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BellIcon size={14} className={reminder.isBrowserNotification ? 'text-[#34C759]' : 'text-[#98989D]'} />
                                      <span>Browser</span>
                                    </div>
                                  </div>

                                </div>
                                {/* <Link
                                  href={`/reminders/${reminder.id}`}
                                  className={`${ReminderStatusColors['pending']} hover:text-white text-sm transition-colors`}
                                >
                                  Edit
                                </Link> */}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <BellIcon size={48} className="mx-auto text-[#98989D] mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No upcoming reminders</h3>
                            <p className="text-[#98989D] mb-4">Create your first reminder to stay organized!</p>
                            <Link href="/reminders">
                              <Button className="bg-[#0A84FF] hover:bg-[#0A74FF]">
                                <BellIcon size={18} className="mr-2" />
                                Create Reminder
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Bottom Row - Quick Actions */}
                <div className="mx-auto">
                  <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
                    <CardHeader>
                      <CardTitle className="text-white text-lg text-center">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/notes" className="block">
                          <Button variant="outline" className="w-full justify-center  bg-[#0A84FF] border-[#3A3A3C] text-white hover:text-white hover:bg-[#3A3A3C]">
                            📝 New Note
                          </Button>
                        </Link>
                        <Link href="/todos" className="block">
                          <Button variant="outline" className="w-full justify-center  bg-[#0A84FF] border-[#3A3A3C] text-white hover:text-white hover:bg-[#3A3A3C]">
                            ✅ Todos
                          </Button>
                        </Link>
                        <Link href="/bookmarks" className="block">
                          <Button variant="outline" className="w-full justify-center  bg-[#0A84FF] border-[#3A3A3C] text-white hover:text-white hover:bg-[#3A3A3C]">
                            🔖 Bookmarks
                          </Button>
                        </Link>
                        <Link href="/reminders" className="block">
                          <Button className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] justify-center">
                            <BellIcon size={18} className="mr-2" />
                            Reminders
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Module Cards for Non-Authenticated Users */}
            {!user && (
              <>
                <WeatherWidget className="w-full max-w-md mx-auto mb-8" />

                <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
                  {/* Notes Card */}
                  <Link href="/notes" className="block">
                    <Card className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                      <h2 className="text-2xl font-semibold mb-3 text-white">Notes</h2>
                      <p className="text-gray-400 mb-4">Manage your notes and thoughts in one place</p>
                      <div className="flex gap-2 justify-center">
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </Card>
                  </Link>

                  {/* Todos Card */}
                  <Link href="/todos" className="block">
                    <Card className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                      <h2 className="text-2xl font-semibold mb-3 text-white">Todos</h2>
                      <p className="text-gray-400 mb-4">Keep track of your tasks and stay organized</p>
                      <div className="flex gap-2 justify-center">
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/jwt/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/jwt/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </Card>
                  </Link>

                  {/* Bookmarks Card */}
                  <Link href="/bookmarks" className="block">
                    <Card className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                      <h2 className="text-2xl font-semibold mb-3 text-white">Bookmarks</h2>
                      <p className="text-gray-400 mb-4">Manage your bookmarks and thoughts in one place</p>
                      <div className="flex gap-2 justify-center">
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </Card>
                  </Link>

                  {/* Reminders Card */}
                  <Link href="/reminders" className="block">
                    <Card className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                      <h2 className="text-2xl font-semibold mb-3 text-white">Reminders</h2>
                      <p className="text-gray-400 mb-4">Never forget important tasks and events</p>
                      <div className="flex gap-2 justify-center">
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/login">Sign In</Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/auth/session/signup">Sign Up</Link>
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
