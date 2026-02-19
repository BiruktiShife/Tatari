"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const serviceAreas = [
  {
    id: "1",
    area: "Bole",
    city: "Addis Ababa",
    radius: "5 km",
    basePrice: "₵ 500",
    travelFee: "₵ 0",
    status: "active",
    jobs: 42,
  },
  {
    id: "2",
    area: "Kasanchis",
    city: "Addis Ababa",
    radius: "7 km",
    basePrice: "₵ 600",
    travelFee: "₵ 100",
    status: "active",
    jobs: 28,
  },
  {
    id: "3",
    area: "Mexico",
    city: "Addis Ababa",
    radius: "10 km",
    basePrice: "₵ 700",
    travelFee: "₵ 200",
    status: "active",
    jobs: 15,
  },
  {
    id: "4",
    area: "Piassa",
    city: "Addis Ababa",
    radius: "8 km",
    basePrice: "₵ 550",
    travelFee: "₵ 150",
    status: "inactive",
    jobs: 0,
  },
];

const popularAreas = [
  "Bole",
  "Kasanchis",
  "Mexico",
  "Piassa",
  "Gerji",
  "CMC",
  "Bole Bulbula",
  "Lebu",
];

export default function ProviderServiceAreaPage() {
  const [selectedAreas, setSelectedAreas] = useState([
    "Bole",
    "Kasanchis",
    "Mexico",
  ]);
  const [newArea, setNewArea] = useState("");
  const [maxDistance, setMaxDistance] = useState("15");
  const [autoAcceptNearby, setAutoAcceptNearby] = useState(true);

  const handleAddArea = () => {
    if (newArea && !selectedAreas.includes(newArea)) {
      setSelectedAreas([...selectedAreas, newArea]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setSelectedAreas(selectedAreas.filter((a) => a !== area));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Area</h1>
          <p className="text-gray-600 mt-2">
            Manage where you provide services
          </p>
        </div>
        <Button variant="outline">
          <Navigation className="h-4 w-4 mr-2" />
          View on Map
        </Button>
      </div>

      {/* Service Area Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Service Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Current Service Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selected Areas */}
              <div>
                <Label className="mb-2 block">Your Service Areas</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="py-1 px-3 text-sm"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {area}
                      <button
                        onClick={() => handleRemoveArea(area)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Add New Area */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new area..."
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    list="popular-areas"
                  />
                  <datalist id="popular-areas">
                    {popularAreas.map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                  <Button onClick={handleAddArea}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Max Distance */}
              <div>
                <Label className="mb-2 block">
                  Maximum Service Distance: {maxDistance} km
                </Label>
                <Input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Auto Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Auto-accept nearby jobs
                    </Label>
                    <p className="text-sm text-gray-500">
                      Automatically accept jobs within preferred distance
                    </p>
                  </div>
                  <Switch
                    checked={autoAcceptNearby}
                    onCheckedChange={setAutoAcceptNearby}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing by Area */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Set different pricing for different service areas
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Travel Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell>
                        <div className="font-medium">{area.area}</div>
                        <div className="text-sm text-gray-500">{area.city}</div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {area.basePrice}
                      </TableCell>
                      <TableCell>
                        {area.travelFee === "₵ 0" ? (
                          <span className="text-gray-500">Free</span>
                        ) : (
                          <span className="text-yellow-600">
                            {area.travelFee}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            area.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {area.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {area.status.charAt(0).toUpperCase() +
                            area.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Area Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Area Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {serviceAreas
              .filter((area) => area.status === "active")
              .map((area) => (
                <Card key={area.id}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{area.jobs}</div>
                      <div className="text-sm text-gray-600">
                        Jobs in {area.area}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {area.radius} radius
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Areas Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Areas to Consider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularAreas
              .filter((area) => !selectedAreas.includes(area))
              .map((area) => (
                <Button
                  key={area}
                  variant="outline"
                  onClick={() => {
                    if (!selectedAreas.includes(area)) {
                      setSelectedAreas([...selectedAreas, area]);
                    }
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {area}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
