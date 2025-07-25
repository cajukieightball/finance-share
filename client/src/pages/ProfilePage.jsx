import React from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Spinner } from "../components/Spinner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios
      .get(`/api/users/${user._id}`)
      .then((res) => setProfile(res.data.user))
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user._id]);

  if (loading) return <Spinner />;

  if (!profile) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p className="mb-2">
        <strong>Username:</strong> {profile.username}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {profile.email}
      </p>
      {/* Add any other profile fields you like here */}
    </div>
  );
}
