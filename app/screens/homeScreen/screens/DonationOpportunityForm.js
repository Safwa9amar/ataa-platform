import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const DonationOpportunityForm = ({ onSubmit, categories, fields }) => {
  const { theme } = useTheme(); // Assuming you're using a theme context
  const [title, setTitle] = useState('');
  const [type, setType] = useState('normalOpportunity');
  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [visits, setVisits] = useState(0);
  const [totalDonation, setTotalDonation] = useState('');
  const [numberBeneficiaries, setNumberBeneficiaries] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [cardImage, setCardImage] = useState('');
  const [fieldId, setFieldId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [progressId, setProgressId] = useState(null);
  const [wilayaCode, setWilayaCode] = useState('');

  const handleSubmit = () => {
    const donationOpportunity = {
      title,
      type,
      overview,
      description,
      visits,
      totalDonation,
      numberBeneficiaries,
      donationCount,
      cardImage,
      fieldId,
      categoryId,
      wilayaCode,
    };
    onSubmit(donationOpportunity);
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: theme.background }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      {/* <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={{ marginBottom: 10 }}
      >
        <Picker.Item label="Normal Opportunity" value="normalOpportunity" />
        <Picker.Item label="Store Opportunity" value="storeOpportunity" />
      </Picker> */}
      <TextInput
        placeholder="Overview"
        value={overview}
        onChangeText={setOverview}
        multiline
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Visits"
        value={visits.toString()}
        onChangeText={(value) => setVisits(parseInt(value))}
        keyboardType="numeric"
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Total Donation"
        value={totalDonation}
        onChangeText={setTotalDonation}
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Number of Beneficiaries"
        value={numberBeneficiaries.toString()}
        onChangeText={(value) => setNumberBeneficiaries(parseInt(value))}
        keyboardType="numeric"
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Donation Count"
        value={donationCount.toString()}
        onChangeText={(value) => setDonationCount(parseInt(value))}
        keyboardType="numeric"
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Card Image URL"
        value={cardImage}
        onChangeText={setCardImage}
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      {/* <Picker
        selectedValue={fieldId}
        onValueChange={(itemValue) => setFieldId(itemValue)}
        style={{ marginBottom: 10 }}
      >
        {fields.map((field) => (
          <Picker.Item
            key={field.id}
            label={field.title}
            value={field.id}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue) => setCategoryId(itemValue)}
        style={{ marginBottom: 10 }}
      >
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.title}
            value={category.id}
          />
        ))}
      </Picker> */}
      <TextInput
        placeholder="Wilaya Code"
        value={wilayaCode}
        onChangeText={setWilayaCode}
        style={{
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Create Donation Opportunity" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default DonationOpportunityForm;
