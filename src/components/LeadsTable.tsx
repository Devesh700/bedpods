import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  Package, 
  IndianRupee,
  Search,
  Download,
  Loader2,
  Users
} from "lucide-react";

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  productName: string;
  price: string;
  originalPrice: string;
  generatedAt: string;
  status?: string;
}

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fetch leads from Firebase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'Leads'));
        const leadsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        
        // Sort by date (newest first)
        leadsData.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
        
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Failed to fetch leads. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads based on search term
  const filteredLeads = useMemo(()=>(leads.filter(lead =>
    lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city.toLowerCase().includes(searchTerm.toLowerCase()))),[leads,searchTerm])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format price
  const formatPrice = (price: string) => {
    return price?.replace(/,/g, '') || '0';
  };

  // Calculate discount percentage
  const getDiscountPercentage = (price: string, originalPrice: string) => {
    if (!price || !originalPrice) return 0;
    const current = parseInt(price.replace(/,/g, ''));
    const original = parseInt(originalPrice.replace(/,/g, ''));
    return Math.round(((original - current) / original) * 100);
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Product', 'Price', 'Original Price', 'City', 'State', 'Address', 'Date'].join(','),
      ...filteredLeads.map(lead => [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.productName,
        lead.price,
        lead.originalPrice,
        lead.city,
        lead.state,
        `"${lead.address}"`, // Wrap address in quotes to handle commas
        formatDate(lead.generatedAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading leads...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
          <p className="text-gray-600 mt-1">{filteredLeads.length} leads found</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={exportToCSV} variant="outline" className="gap-2" disabled={filteredLeads.length === 0}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
            <Package className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Potential Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{leads.reduce((sum, lead) => sum + parseInt(formatPrice(lead.price)), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Unique Emails</p>
                <p className="text-2xl font-bold">{new Set(leads.map(l => l.email)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Leads</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => new Date(l.generatedAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, product, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Leads
          </CardTitle>
          <CardDescription>
            View and manage all customer leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Product Interest</TableHead>
                    <TableHead className="font-semibold">Pricing</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Lead Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Customer Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{lead.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Product Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 max-w-[200px]">{lead.productName}</p>
                          {lead.price && lead.originalPrice && (
                            <Badge variant="secondary" className="text-xs">
                              {getDiscountPercentage(lead.price, lead.originalPrice)}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Pricing */}
                      <TableCell>
                        <div className="space-y-1">
                          {lead.price && (
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-600 text-lg">
                                ₹{parseInt(formatPrice(lead.price)).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {lead.originalPrice && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-500 line-through">
                                ₹{parseInt(formatPrice(lead.originalPrice)).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{lead.city}</p>
                            <p className="text-sm text-gray-600">{lead.state}</p>
                            <p className="text-xs text-gray-500 max-w-[200px] truncate" title={lead.address}>
                              {lead.address}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Lead Date */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(lead.generatedAt)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge 
                          variant="default" 
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          New Lead
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLeads.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search criteria" : "No leads available yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Lead Details</CardTitle>
                  <CardDescription>Complete lead information</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedLead.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedLead.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedLead.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Address</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p>{selectedLead.address}</p>
                      <p>{selectedLead.city}, {selectedLead.state}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Product Interest & Pricing</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-lg">{selectedLead.productName}</p>
                      <p className="text-sm text-gray-600">
                        Lead generated on {formatDate(selectedLead.generatedAt)}
                      </p>
                    </div>
                    {selectedLead.price && selectedLead.originalPrice && (
                      <Badge className="bg-green-100 text-green-800">
                        {getDiscountPercentage(selectedLead.price, selectedLead.originalPrice)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  {selectedLead.price && selectedLead.originalPrice && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Original Price</p>
                        <p className="text-lg line-through text-gray-500">
                          ₹{parseInt(formatPrice(selectedLead.originalPrice)).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Interested Price</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{parseInt(formatPrice(selectedLead.price)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
