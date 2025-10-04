"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { ExoplanetData } from "@/lib/dummy-data"
import { parseCSV } from "@/lib/dummy-data"
import { Upload, Download, Settings, ArrowUpDown, Search, AlertCircle, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveExoplanets, loadExoplanets } from "@/lib/storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DataExplorerPage() {
  const { toast } = useToast()
  const [data, setData] = useState<ExoplanetData[]>([])
  const [filteredData, setFilteredData] = useState<ExoplanetData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof ExoplanetData>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isOpen, setIsOpen] = useState(false)

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    snr: true,
    flag_1: true,
    flag_2: true,
    flag_3: true,
    flag_4: true,
    disposition_score: true,
    planetary_radius: true,
    insolation_flux: true,
    surface_gravity: true,
    orbital_period: true,
    transit_duration: true,
    transit_depth: true,
    impact_parameter: true,
    stellar_magnitude: true,
    classification: true,
    confidence: true,
  })

  useEffect(() => {
    const storedData = loadExoplanets()
    setData(storedData)
    setLoading(false)
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, sortColumn, sortDirection])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/exoplanets")
      const result = await response.json()
      setData(result.exoplanets)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load exoplanet data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal)
      const bStr = String(bVal)
      return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })

    setFilteredData(filtered)
  }

  const handleSort = (column: keyof ExoplanetData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string
        const parsedData = parseCSV(csvText)
        setData(parsedData)
        saveExoplanets(parsedData)
        setIsOpen(true)
        toast({
          title: "Success",
          description: `Loaded ${parsedData.length} exoplanets from CSV`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const exportToCSV = () => {
    const headers = Object.keys(visibleColumns).filter((key) => visibleColumns[key as keyof typeof visibleColumns])
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => headers.map((header) => row[header as keyof ExoplanetData]).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "exoplanet_data.csv"
    a.click()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Exoplanet Data Explorer</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Browse, filter, and analyze comprehensive exoplanet data including SNR, flags, and all key parameters.
          </p>
        </div>

        {data.length === 0 && !loading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              Please upload a CSV file with exoplanet data to begin analysis. Your data should include columns for SNR,
              flags, disposition score, and other key parameters.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Data Summary</CardTitle>
                <CardDescription>
                  {data.length === 0 ? "No data loaded" : `${filteredData.length} exoplanets loaded`}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                  <Button asChild variant="outline">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </label>
                  </Button>
                </div>

                <Button variant="outline" onClick={exportToCSV} disabled={data.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={data.length === 0}>
                      <Settings className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {Object.keys(visibleColumns).map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column}
                        checked={visibleColumns[column as keyof typeof visibleColumns]}
                        onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, [column]: checked }))}
                      >
                        {column.replace(/_/g, " ").toUpperCase()}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {data.length > 0 && (
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </CardHeader>

          {data.length > 0 && (
            <CardContent>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>View Raw Data Table</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {visibleColumns.id && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("id")} className="h-8 px-2">
                                ID <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.name && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("name")} className="h-8 px-2">
                                Name <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.snr && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("snr")} className="h-8 px-2">
                                SNR <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.flag_1 && <TableHead>Flag 1</TableHead>}
                          {visibleColumns.flag_2 && <TableHead>Flag 2</TableHead>}
                          {visibleColumns.flag_3 && <TableHead>Flag 3</TableHead>}
                          {visibleColumns.flag_4 && <TableHead>Flag 4</TableHead>}
                          {visibleColumns.disposition_score && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("disposition_score")}
                                className="h-8 px-2"
                              >
                                Disp. Score <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.planetary_radius && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("planetary_radius")}
                                className="h-8 px-2"
                              >
                                Radius (R⊕) <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.insolation_flux && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("insolation_flux")}
                                className="h-8 px-2"
                              >
                                Insol. Flux <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.surface_gravity && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("surface_gravity")}
                                className="h-8 px-2"
                              >
                                Gravity <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.orbital_period && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("orbital_period")} className="h-8 px-2">
                                Period (d) <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.transit_duration && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("transit_duration")}
                                className="h-8 px-2"
                              >
                                Duration (h) <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.transit_depth && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("transit_depth")} className="h-8 px-2">
                                Depth <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.impact_parameter && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("impact_parameter")}
                                className="h-8 px-2"
                              >
                                Impact <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.stellar_magnitude && (
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("stellar_magnitude")}
                                className="h-8 px-2"
                              >
                                Mag <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.classification && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("classification")} className="h-8 px-2">
                                Classification <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                          {visibleColumns.confidence && (
                            <TableHead>
                              <Button variant="ghost" onClick={() => handleSort("confidence")} className="h-8 px-2">
                                Confidence <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={18} className="text-center py-8">
                              Loading data...
                            </TableCell>
                          </TableRow>
                        ) : filteredData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={18} className="text-center py-8">
                              No data found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredData.map((row) => (
                            <TableRow key={row.id}>
                              {visibleColumns.id && <TableCell className="font-mono text-sm">{row.id}</TableCell>}
                              {visibleColumns.name && <TableCell>{row.name}</TableCell>}
                              {visibleColumns.snr && <TableCell>{row.snr.toFixed(2)}</TableCell>}
                              {visibleColumns.flag_1 && (
                                <TableCell>
                                  <Badge variant={row.flag_1 ? "destructive" : "secondary"}>
                                    {row.flag_1 ? "Yes" : "No"}
                                  </Badge>
                                </TableCell>
                              )}
                              {visibleColumns.flag_2 && (
                                <TableCell>
                                  <Badge variant={row.flag_2 ? "destructive" : "secondary"}>
                                    {row.flag_2 ? "Yes" : "No"}
                                  </Badge>
                                </TableCell>
                              )}
                              {visibleColumns.flag_3 && (
                                <TableCell>
                                  <Badge variant={row.flag_3 ? "destructive" : "secondary"}>
                                    {row.flag_3 ? "Yes" : "No"}
                                  </Badge>
                                </TableCell>
                              )}
                              {visibleColumns.flag_4 && (
                                <TableCell>
                                  <Badge variant={row.flag_4 ? "destructive" : "secondary"}>
                                    {row.flag_4 ? "Yes" : "No"}
                                  </Badge>
                                </TableCell>
                              )}
                              {visibleColumns.disposition_score && (
                                <TableCell>{row.disposition_score.toFixed(3)}</TableCell>
                              )}
                              {visibleColumns.planetary_radius && (
                                <TableCell>{row.planetary_radius.toFixed(2)}</TableCell>
                              )}
                              {visibleColumns.insolation_flux && (
                                <TableCell>{row.insolation_flux.toFixed(2)}</TableCell>
                              )}
                              {visibleColumns.surface_gravity && (
                                <TableCell>{row.surface_gravity.toFixed(2)}</TableCell>
                              )}
                              {visibleColumns.orbital_period && <TableCell>{row.orbital_period.toFixed(2)}</TableCell>}
                              {visibleColumns.transit_duration && (
                                <TableCell>{row.transit_duration.toFixed(2)}</TableCell>
                              )}
                              {visibleColumns.transit_depth && <TableCell>{row.transit_depth.toFixed(4)}</TableCell>}
                              {visibleColumns.impact_parameter && (
                                <TableCell>{row.impact_parameter.toFixed(3)}</TableCell>
                              )}
                              {visibleColumns.stellar_magnitude && (
                                <TableCell>{row.stellar_magnitude.toFixed(2)}</TableCell>
                              )}
                              {visibleColumns.classification && (
                                <TableCell>
                                  <Badge
                                    variant={
                                      row.classification === "Confirmed"
                                        ? "default"
                                        : row.classification === "Candidate"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {row.classification}
                                  </Badge>
                                </TableCell>
                              )}
                              {visibleColumns.confidence && <TableCell>{(row.confidence * 100).toFixed(1)}%</TableCell>}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
