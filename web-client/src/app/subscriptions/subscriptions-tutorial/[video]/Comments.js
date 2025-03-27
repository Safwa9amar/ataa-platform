import React from "react";
import { motion } from "framer-motion";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
import { FaUserCircle } from "react-icons/fa";
import { useCredentials } from "@/context/CredentialsContext";
function Comments() {
  const { user, loading } = useCredentials();
  const data = [
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      userProfile: "https://www.linkedin.com/in/riya-negi-8879631a9/",
      text: "I think you have a point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
      timestamp: "2024-09-28T12:34:56Z",
      replies: [],
    },
  ];

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      dir="ltr"
    >
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center lg:text-right">
        تعليقات المشاهدين
      </h3>

      {/* Input for Adding New Comment */}
      {!loading && (
        <CommentSection
          currentUser={{
            currentUserId: user.id,
            currentUserImg: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.photo}`,
            currentUserFullName: user.name,
          }}
          logIn={{
            onLogin: () => alert("Call login function "),
            signUpLink: "http://localhost:3001/",
          }}
          commentData={data}
          placeholder="Write your comment..."
          onSubmitAction={(data) => console.log("check submit, ", data)}
          currentData={(data) => {
            console.log("current data", data);
          }}
        />
      )}
    </motion.div>
  );
}

export default Comments;
