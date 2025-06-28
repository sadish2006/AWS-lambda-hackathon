
import React, { useState } from 'react';
import { PlagiarismChecker } from '@/components/PlagiarismChecker';
import { AITextDetector } from '@/components/AITextDetector';
import { TextHumanizer } from '@/components/TextHumanizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bot, RefreshCw } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('plagiarism');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Advanced Text Analysis Suite
          </h1>
          <p className="text-gray-600 text-lg">
            Professional tools for plagiarism detection, AI text analysis, and content humanization
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center text-gray-700">
              Choose Your Analysis Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-gray-100 rounded-xl p-1">
                <TabsTrigger 
                  value="plagiarism" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  Plagiarism Checker
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-detector" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Bot className="w-4 h-4" />
                  AI Text Detector
                </TabsTrigger>
                <TabsTrigger 
                  value="humanizer" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Text Humanizer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plagiarism" className="mt-0">
                <PlagiarismChecker />
              </TabsContent>

              <TabsContent value="ai-detector" className="mt-0">
                <AITextDetector />
              </TabsContent>

              <TabsContent value="humanizer" className="mt-0">
                <TextHumanizer />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Powered by advanced AI algorithms for accurate text analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
