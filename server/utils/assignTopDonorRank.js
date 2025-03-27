function assignTopDonorRank(users) {
  return users.map((user) => {
    if (user.totalDonatedAmount >= 1000000) {
      user.topDonorRank = "Platinum";
    } else if (user.totalDonatedAmount >= 100000) {
      user.topDonorRank = "Gold";
    } else if (user.totalDonatedAmount >= 10000) {
      user.topDonorRank = "Silver";
    } else if (user.totalDonatedAmount >= 1000) {
      user.topDonorRank = "Bronze";
    } else {
      user.topDonorRank = "Star";
    }
    return user;
  });
}
function assignTopDonorRankToUser(user) {
  if (user.totalDonatedAmount >= 1000000) {
    user.topDonorRank = "Platinum";
  } else if (user.totalDonatedAmount >= 100000) {
    user.topDonorRank = "Gold";
  } else if (user.totalDonatedAmount >= 10000) {
    user.topDonorRank = "Silver";
  } else if (user.totalDonatedAmount >= 1000) {
    user.topDonorRank = "Bronze";
  } else {
    user.topDonorRank = "Star";
  }
  return user;
}

module.exports = { assignTopDonorRank, assignTopDonorRankToUser };
