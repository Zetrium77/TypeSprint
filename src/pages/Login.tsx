import { auth, provider, signInWithPopup, signOut } from "../firebase";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useLanguage } from "../theme/LanguageProvider";

const LoginPage = () => {
    const { language } = useLanguage();
    const [user, setUser] = useState<User | null>(auth?.currentUser || null);
    const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(!!auth && !!provider);

    // Translations
    const translations = {
        en: {
            signInTitle: "Sign in to your account",
            signInSubtitle: "Track your typing progress across devices",
            signInWithGoogle: "Sign in with Google",
            signOut: "Sign out",
            welcome: "Welcome,",
            firebaseNotConfigured: "Firebase Not Configured",
            firebaseNotConfiguredDesc: "Authentication is currently unavailable because Firebase configuration is missing.",
            envFileInstruction: "Please create a .env file in the project root with your Firebase configuration:",
            localStatsNote: "You can still use the trainer — statistics will be saved locally only.",
            loginError: "Login failed. Please try again.",
            logoutError: "Logout failed. Please try again.",
            firebaseNotConfiguredError: "Firebase is not configured. Please check your .env file."
        },
        ru: {
            signInTitle: "Войдите в аккаунт",
            signInSubtitle: "Отслеживайте прогресс печати на всех устройствах",
            signInWithGoogle: "Войти через Google",
            signOut: "Выйти",
            welcome: "Добро пожаловать,",
            firebaseNotConfigured: "Firebase не настроен",
            firebaseNotConfiguredDesc: "Аутентификация в данный момент недоступна, так как отсутствует конфигурация Firebase.",
            envFileInstruction: "Пожалуйста, создайте файл .env в корне проекта с конфигурацией Firebase:",
            localStatsNote: "Вы всё равно можете пользоваться тренажёром — статистика будет сохраняться только локально.",
            loginError: "Ошибка входа. Попробуйте ещё раз.",
            logoutError: "Ошибка выхода. Попробуйте ещё раз.",
            firebaseNotConfiguredError: "Firebase не настроен. Проверьте файл .env."
        },
        pl: {
            signInTitle: "Zaloguj się do swojego konta",
            signInSubtitle: "Śledź swój postęp w pisaniu na wszystkich urządzeniach",
            signInWithGoogle: "Zaloguj się przez Google",
            signOut: "Wyloguj się",
            welcome: "Witaj,",
            firebaseNotConfigured: "Firebase nie jest skonfigurowany",
            firebaseNotConfiguredDesc: "Uwierzytelnianie jest obecnie niedostępne, ponieważ brakuje konfiguracji Firebase.",
            envFileInstruction: "Proszę utwórz plik .env w głównym katalogu projektu z konfiguracją Firebase:",
            localStatsNote: "Nadal możesz korzystać z trenera — statystyki będą zapisywane tylko lokalnie.",
            loginError: "Logowanie nie powiodło się. Spróbuj ponownie.",
            logoutError: "Wylogowanie nie powiodło się. Spróbuj ponownie.",
            firebaseNotConfiguredError: "Firebase nie jest skonfigurowany. Sprawdź plik .env."
        }
    };

    const t = translations[language];

    const handleLogin = async () => {
        if (!auth || !provider) {
            alert(t.firebaseNotConfiguredError);
            return;
        }
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (e) {
            console.error("Login error:", e);
            alert(t.loginError);
        }
    };

    const handleLogout = async () => {
        if (!auth) {
            alert(t.firebaseNotConfiguredError);
            return;
        }
        try {
            await signOut(auth);
            setUser(null);
        } catch (e) {
            console.error("Logout error:", e);
            alert(t.logoutError);
        }
    };

    useEffect(() => {
        if (!auth) {
            setIsFirebaseAvailable(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if (!isFirebaseAvailable) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 text-red-500">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-[var(--color-text)]">
                            {t.firebaseNotConfigured}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            {t.firebaseNotConfiguredDesc}<br />
                            {t.envFileInstruction}
                        </p>
                        <pre className="mt-2 text-xs bg-red-100 dark:bg-red-800 p-2 rounded overflow-x-auto text-left">
                            {`VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}
                        </pre>
                        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                            {t.localStatsNote}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
            <div className="max-w-md w-full space-y-8 p-8">
                {user ? (
                    // User is logged in - show welcome message
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-[var(--color-text)]">
                            {t.welcome}
                        </h2>
                        <div className="mt-8 space-y-6">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center">
                                    {user.photoURL && (
                                        <img
                                            className="h-12 w-12 rounded-full mr-4"
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                        />
                                    )}
                                    <div>
                                        <p className="text-lg font-medium text-[var(--color-text)]">
                                            {user.displayName || user.email}
                                        </p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    {t.signOut}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // User is not logged in - show sign-in form
                    <>
                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-extrabold text-[var(--color-text)]">
                                {t.signInTitle}
                            </h2>
                            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                                {t.signInSubtitle}
                            </p>
                        </div>
                        <div className="mt-8 space-y-6">
                            <button
                                onClick={handleLogin}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {t.signInWithGoogle}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
