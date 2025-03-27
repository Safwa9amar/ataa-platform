const prisma = require("../models");

class NationalCampaignService {
  async getAllCampaigns() {
    return prisma.nationalCampaign.findMany({
      include: {
        bloodAgency: true,
      },
    });
  }

  async getCampaignById(id) {
    return prisma.nationalCampaign.findUnique({
      where: { id },
      include: {
        bloodAgency: true,
      },
    });
  }

  async getCampaignByQuery(query) {
    console.log(query);

    return prisma.nationalCampaign.findMany({
      where: query,
      include: {
        bloodAgency: true,
      },
    });
  }

  async createCampaign(data) {
    return prisma.nationalCampaign.create({
      data,
    });
  }

  async updateCampaign(id, data) {
    return prisma.nationalCampaign.update({
      where: { id },
      data,
    });
  }

  async deleteCampaign(id) {
    return prisma.nationalCampaign.delete({
      where: { id },
    });
  }
}

module.exports = new NationalCampaignService();
