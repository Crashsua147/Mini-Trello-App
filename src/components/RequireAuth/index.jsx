import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/userStore";
import axios from "axios";

function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userModel, setUserModel } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const res = await axios.get(
          `http://localhost:4000/api/user?userId=${userId}`,
          {
            withCredentials: true,
          }
        );

        setUserModel(res.data);
        setLoading(false);
      } catch (err) {
        console.warn("Không xác thực được:", err);
        setUserModel(null);
        setLoading(false);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, setUserModel]);

  if (loading) return <p>🔄 Đang kiểm tra đăng nhập...</p>;
  if (!userModel) return null;

  return children;
}

export default RequireAuth;
