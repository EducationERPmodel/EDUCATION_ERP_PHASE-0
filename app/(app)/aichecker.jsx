import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import stringSimilarity from 'string-similarity';
import { extractTextFromFile } from '../../src/utils/pdfUtils';
import FileUpload from '../../src/components/aichecker/FileUpload';
import SimilarityResult from '../../src/components/aichecker/SimilarityResult';
import AnalysisReport from '../../src/components/aichecker/AnalysisReport';
import MatchedSentences from '../../src/components/aichecker/MatchedSentences';
import DownloadReport from '../../src/components/aichecker/DownloadReport';
import Colors from '../../src/theme/colors';

function cleanText(raw) {
  return raw
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function AICheckerScreen() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [score, setScore] = useState(null);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!file1 || !file2) {
      Alert.alert('Missing Files', 'Please select both assignment files.');
      return;
    }
    setLoading(true);
    try {
      let raw1 = await extractTextFromFile(file1);
      let raw2 = await extractTextFromFile(file2);

      if (raw1 === '__PDF_UNSUPPORTED__' || raw2 === '__PDF_UNSUPPORTED__') {
        Alert.alert(
          'PDF Limitation',
          'PDF text extraction is not supported in this environment. Please upload .txt files for full analysis.'
        );
        setLoading(false);
        return;
      }

      const cleaned1 = cleanText(raw1);
      const cleaned2 = cleanText(raw2);
      setText1(cleaned1);
      setText2(cleaned2);

      const similarity = stringSimilarity.compareTwoStrings(cleaned1, cleaned2);
      setScore(Math.round(similarity * 100));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to compare the files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>🤖 AI Similarity Checker</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <FileUpload file1={file1} setFile1={setFile1} file2={file2} setFile2={setFile2} />

          <TouchableOpacity
            style={[styles.analyzeBtn, loading && { opacity: 0.7 }]}
            onPress={handleCheck}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.analyzeBtnText}>Analyze Assignments</Text>
            }
          </TouchableOpacity>

          <SimilarityResult score={score} />
          <AnalysisReport score={score} file1={file1} file2={file2} />
          <DownloadReport score={score} file1={file1} file2={file2} />
          <MatchedSentences text1={text1} text2={text2} />
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  scroll: { flex: 1 },
  inner: { padding: 16 },
  analyzeBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginBottom: 14,
  },
  analyzeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
