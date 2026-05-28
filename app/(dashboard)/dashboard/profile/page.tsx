"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Loader2, User, Lock, Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          setProfileData({
            name: json.data.name,
            email: json.data.email,
          });
        }
      } catch {
        setProfileError("فشل تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess]);

  useEffect(() => {
    if (profileError) {
      const timer = setTimeout(() => setProfileError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [profileError]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => setPasswordSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  useEffect(() => {
    if (passwordError) {
      const timer = setTimeout(() => setPasswordError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordError]);

  const handleProfileUpdate = useCallback(async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const json = await res.json();

      if (json.success) {
        setUser(json.data);
        setProfileSuccess("تم تحديث الملف الشخصي بنجاح");
      } else {
        setProfileError(json.error || "فشل تحديث الملف الشخصي");
      }
    } catch {
      setProfileError("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setProfileSaving(false);
    }
  }, [profileData]);

  const handlePasswordChange = useCallback(async () => {
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError("الرجاء إدخال كلمة المرور الحالية");
      setPasswordSaving(false);
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("الرجاء إدخال كلمة المرور الجديدة");
      setPasswordSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      setPasswordSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("كلمة المرور الجديدة غير متطابقة");
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });

      const json = await res.json();

      if (json.success) {
        setPasswordSuccess("تم تغيير كلمة المرور بنجاح");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(json.error || "فشل تغيير كلمة المرور");
      }
    } catch {
      setPasswordError("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setPasswordSaving(false);
    }
  }, [passwordData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Info Card */}
      <ContentCard
        title="معلومات الملف الشخصي"
        subtitle="تحديث بياناتك الشخصية والبريد الإلكتروني"
      >
        <div className="space-y-6">
          {/* Success/Error Messages */}
          {profileSuccess && (
            <div className="bg-[#f0fdf4] border border-[#1a9a5a]/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#1a9a5a] shrink-0" />
              <p className="text-[#1a9a5a] text-sm">{profileSuccess}</p>
            </div>
          )}
          {profileError && (
            <div className="bg-[#fef2f2] border border-[#dc2626]/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0" />
              <p className="text-[#dc2626] text-sm">{profileError}</p>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#e8edf5]">
            <div className="w-20 h-20 rounded-full bg-[#5ddfb8]/20 flex items-center justify-center shrink-0">
              <span className="text-[#5ddfb8] text-2xl font-bold">
                {user?.name?.charAt(0) || "م"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0c2954]">
                {user?.name || "مدير النظام"}
              </h3>
              <p className="text-sm text-[#6b7a94]">
                {user?.role === "admin" ? "مدير النظام" : "مستخدم"}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="الاسم الكامل"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="أدخل اسمك الكامل"
              icon={<User className="w-4 h-4 text-[#6b7a94]" />}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="name@example.com"
            />
          </div>

          {/* Account Info */}
          <div className="bg-[#f5f6f9] rounded-lg p-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[#6b7a94]">تاريخ الإنشاء:</span>{" "}
                <span className="text-[#0c2954] font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("ar-SA-u-nu-latn")
                    : "—"}
                </span>
              </div>
              <div>
                <span className="text-[#6b7a94]">آخر تحديث:</span>{" "}
                <span className="text-[#0c2954] font-medium">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("ar-SA-u-nu-latn")
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <DashboardButton
              onClick={handleProfileUpdate}
              disabled={profileSaving}
              className="flex items-center gap-2"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </>
              )}
            </DashboardButton>
          </div>
        </div>
      </ContentCard>

      {/* Change Password Card */}
      <ContentCard
        title="تغيير كلمة المرور"
        subtitle="قم بتغيير كلمة المرور الخاصة بك لحماية حسابك"
      >
        <div className="space-y-6">
          {/* Success/Error Messages */}
          {passwordSuccess && (
            <div className="bg-[#f0fdf4] border border-[#1a9a5a]/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#1a9a5a] shrink-0" />
              <p className="text-[#1a9a5a] text-sm">{passwordSuccess}</p>
            </div>
          )}
          {passwordError && (
            <div className="bg-[#fef2f2] border border-[#dc2626]/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0" />
              <p className="text-[#dc2626] text-sm">{passwordError}</p>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <Input
                label="كلمة المرور الحالية"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="أدخل كلمة المرور الحالية"
                icon={<Lock className="w-4 h-4 text-[#6b7a94]" />}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute left-3 top-[38px] text-[#6b7a94] hover:text-[#0c2954] transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  label="كلمة المرور الجديدة"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="أدخل كلمة المرور الجديدة"
                  icon={<Lock className="w-4 h-4 text-[#6b7a94]" />}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute left-3 top-[38px] text-[#6b7a94] hover:text-[#0c2954] transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="تأكيد كلمة المرور الجديدة"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  icon={<Lock className="w-4 h-4 text-[#6b7a94]" />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute left-3 top-[38px] text-[#6b7a94] hover:text-[#0c2954] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-[#f5f6f9] rounded-lg p-4">
            <p className="text-sm text-[#6b7a94] mb-2">متطلبات كلمة المرور:</p>
            <ul className="text-sm text-[#6b7a94] space-y-1">
              <li
                className={cn(
                  "flex items-center gap-2",
                  passwordData.newPassword.length >= 6
                    ? "text-[#1a9a5a]"
                    : "text-[#6b7a94]"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    passwordData.newPassword.length >= 6
                      ? "bg-[#1a9a5a]"
                      : "bg-[#6b7a94]"
                  )}
                />
                على الأقل 6 أحرف
              </li>
              <li
                className={cn(
                  "flex items-center gap-2",
                  passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length > 0
                    ? "text-[#1a9a5a]"
                    : "text-[#6b7a94]"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    passwordData.newPassword === passwordData.confirmPassword &&
                      passwordData.newPassword.length > 0
                      ? "bg-[#1a9a5a]"
                      : "bg-[#6b7a94]"
                  )}
                />
                كلمتا المرور متطابقتان
              </li>
            </ul>
          </div>

          {/* Change Password Button */}
          <div className="flex justify-end">
            <DashboardButton
              variant="secondary"
              onClick={handlePasswordChange}
              disabled={passwordSaving}
              className="flex items-center gap-2"
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارٍ التغيير...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  تغيير كلمة المرور
                </>
              )}
            </DashboardButton>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}
