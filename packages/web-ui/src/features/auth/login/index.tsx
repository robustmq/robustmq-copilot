import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { setStoredToken, getApiBaseUrl } from '@/utils/requestApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Zap, Shield, Cloud, Cpu, Lock, User } from 'lucide-react';
import Logo from '@/assets/logo.png';
import { APP_CONFIG } from '@/config/constant';

interface FallingQ {
  id: number;
  left: number;
  duration: number;
  delay: number;
  rotation: number;
  fontSize: number;
  letter: string;
}

export default function Login() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [fallingQs, setFallingQs] = useState<FallingQ[]>([]);
  const qIdRef = useRef(0);

  // 生成飘落的字母
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isHovering) {
      interval = setInterval(() => {
        const letters = ['1', '1', '3', '0', 'Q']; // 可选的掉落元素
        const newQ: FallingQ = {
          id: qIdRef.current++,
          left: Math.random() * 100, // 随机水平位置 (0-100%)
          duration: 3 + Math.random() * 3, // 随机持续时间 (3-6秒)，全屏飘落需要更长时间
          delay: 0,
          rotation: Math.random() * 720 - 360, // 随机旋转 (-360 到 360 度)
          fontSize: 20 + Math.random() * 20, // 随机字体大小 (20-40px)，全屏飘落可以更大
          letter: letters[Math.floor(Math.random() * letters.length)], // 随机选择一个字母
        };

        setFallingQs(prev => [...prev, newQ]);

        // 动画完成后移除
        setTimeout(
          () => {
            setFallingQs(prev => prev.filter(q => q.id !== newQ.id));
          },
          (newQ.duration + newQ.delay) * 1000,
        );
      }, 120); // 每120ms生成一个新的字母，全屏需要更多
    } else {
      setFallingQs([]); // 鼠标离开时清除所有
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const res = await axios.post(`${getApiBaseUrl()}/api/v1/login`, {
        username,
        password,
      });
      const { token, expires_in } = res.data?.data ?? {};
      if (!token) {
        setLoginError('Login failed: no token returned');
        return;
      }
      setStoredToken(token, Math.ceil(expires_in / 3600) || 8);
      Cookies.set('isAuthenticated', 'true', { expires: expires_in / 86400 });
      navigate({ to: '/' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed';
      setLoginError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950">
      {/* 动画背景网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* 动画光晕效果 */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* 全屏飘落的字母 */}
      {fallingQs.map(q => (
        <div
          key={q.id}
          className="absolute pointer-events-none text-purple-400/60 font-bold z-50"
          style={{
            left: `${q.left}%`,
            top: '0',
            fontSize: `${q.fontSize}px`,
            animation: `fall-${q.id} ${q.duration}s linear forwards`,
            animationDelay: `${q.delay}s`,
          }}
        >
          <style>{`
            @keyframes fall-${q.id} {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(${q.rotation}deg);
                opacity: 0;
              }
            }
          `}</style>
          {q.letter}
        </div>
      ))}

      <div className="relative min-h-screen flex">
        {/* 左侧 - 品牌展示 */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 text-white">
          <div className="space-y-8 max-w-xl">
            {/* Logo 和标题 */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 rounded-full" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xl">
                    <img src={Logo} alt="RobustMQ" className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                    {APP_CONFIG.NAME}
                  </h1>
                  <p className="text-sm text-purple-300 font-medium">{t('brand_tagline')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold leading-tight">
                  {t('brand_subtitle')}
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {t('brand_description')}
                  </span>
                </h2>
                <p className="text-purple-200 text-lg">{t('brand_detail')}</p>
              </div>
            </div>

            {/* 特性列表 */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
                    <Shield className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-sm font-semibold text-purple-200">{t('feature_performance')}</span>
                </div>
                <p className="text-xs text-purple-300/80 pl-11">{t('feature_performance_desc')}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30">
                    <Zap className="h-5 w-5 text-indigo-300" />
                  </div>
                  <span className="text-sm font-semibold text-indigo-200">{t('feature_protocol')}</span>
                </div>
                <p className="text-xs text-indigo-300/80 pl-11">{t('feature_protocol_desc')}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-blue-400/30">
                    <Cpu className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="text-sm font-semibold text-blue-200">{t('feature_ai')}</span>
                </div>
                <p className="text-xs text-blue-300/80 pl-11">{t('feature_ai_desc')}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
                    <Cloud className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-sm font-semibold text-purple-200">{t('feature_edge')}</span>
                </div>
                <p className="text-xs text-purple-300/80 pl-11">{t('feature_edge_desc')}</p>
              </div>
            </div>

            {/* 底部标语 */}
            <div
              className="pt-8 border-t border-purple-500/30 relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <p className="text-sm text-purple-300/80 italic select-none cursor-default">
                "One data plane. Every protocol. No more bridges."
              </p>
            </div>
          </div>
        </div>

        {/* 右侧 - 登录表单 */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <div className="p-8 space-y-6">
              {/* 移动端 Logo */}
              <div className="lg:hidden text-center space-y-2 mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                  <img src={Logo} alt="RobustMQ" className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-white">{APP_CONFIG.NAME}</h1>
                <p className="text-sm text-purple-300">{t('management_console')}</p>
              </div>

              {/* 登录标题 */}
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white">{t('login_title')}</h2>
                <p className="text-sm text-purple-300">{t('login_subtitle')}</p>
              </div>

              {/* 登录表单 */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white font-medium">
                    {t('username')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 h-12"
                      placeholder={t('username_placeholder')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 focus:ring-purple-400/30 h-12"
                      placeholder={t('password_placeholder')}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('signing_in')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>{t('sign_in')}</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* 错误信息 */}
              {loginError && (
                <div className="pt-2 text-center">
                  <p className="text-xs text-red-400">{loginError}</p>
                </div>
              )}

              {/* 提示信息 */}
              <div className="pt-2 text-center">
                <p className="text-xs text-purple-300/70">{t('default_credentials')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 添加动画样式 */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 20s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
