"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Search, User, Shield, Clock, Eye, EyeOff } from "lucide-react"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "admin" | "manager" | "cashier" | "inventory"
  status: "active" | "inactive"
  hireDate: string
  lastLogin: string
  permissions: {
    sales: boolean
    inventory: boolean
    customers: boolean
    reports: boolean
    settings: boolean
    employees: boolean
  }
  hourlyRate?: number
  pin: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: {
    sales: boolean
    inventory: boolean
    customers: boolean
    reports: boolean
    settings: boolean
    employees: boolean
  }
}

const defaultRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: {
      sales: true,
      inventory: true,
      customers: true,
      reports: true,
      settings: true,
      employees: true,
    },
  },
  {
    id: "manager",
    name: "Manager",
    description: "Management access with reporting and inventory control",
    permissions: {
      sales: true,
      inventory: true,
      customers: true,
      reports: true,
      settings: false,
      employees: true,
    },
  },
  {
    id: "cashier",
    name: "Cashier",
    description: "Sales and customer management access",
    permissions: {
      sales: true,
      inventory: false,
      customers: true,
      reports: false,
      settings: false,
      employees: false,
    },
  },
  {
    id: "inventory",
    name: "Inventory Clerk",
    description: "Inventory management and basic sales access",
    permissions: {
      sales: true,
      inventory: true,
      customers: false,
      reports: false,
      settings: false,
      employees: false,
    },
  },
]

const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@retailpos.com",
    phone: "+1 (555) 123-4567",
    role: "admin",
    status: "active",
    hireDate: "2023-01-15",
    lastLogin: "2024-01-15 09:30:00",
    permissions: defaultRoles[0].permissions,
    hourlyRate: 25.0,
    pin: "1234",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@retailpos.com",
    phone: "+1 (555) 987-6543",
    role: "manager",
    status: "active",
    hireDate: "2023-03-20",
    lastLogin: "2024-01-14 18:45:00",
    permissions: defaultRoles[1].permissions,
    hourlyRate: 20.0,
    pin: "5678",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@retailpos.com",
    phone: "+1 (555) 456-7890",
    role: "cashier",
    status: "active",
    hireDate: "2023-06-10",
    lastLogin: "2024-01-15 08:15:00",
    permissions: defaultRoles[2].permissions,
    hourlyRate: 15.0,
    pin: "9012",
  },
  {
    id: "4",
    firstName: "Lisa",
    lastName: "Wilson",
    email: "lisa.wilson@retailpos.com",
    phone: "+1 (555) 321-0987",
    role: "inventory",
    status: "inactive",
    hireDate: "2023-08-05",
    lastLogin: "2024-01-10 16:20:00",
    permissions: defaultRoles[3].permissions,
    hourlyRate: 16.0,
    pin: "3456",
  },
]

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [showPins, setShowPins] = useState(false)

  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id" | "lastLogin">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "cashier",
    status: "active",
    hireDate: new Date().toISOString().split("T")[0],
    permissions: defaultRoles[2].permissions,
    hourlyRate: 15.0,
    pin: "",
  })

  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    permissions: {
      sales: false,
      inventory: false,
      customers: false,
      reports: false,
      settings: false,
      employees: false,
    },
  })

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || employee.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleAddEmployee = () => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      lastLogin: "Never",
      pin: newEmployee.pin || Math.floor(1000 + Math.random() * 9000).toString(),
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "cashier",
      status: "active",
      hireDate: new Date().toISOString().split("T")[0],
      permissions: defaultRoles[2].permissions,
      hourlyRate: 15.0,
      pin: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
  }

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      setEmployees(employees.map((e) => (e.id === editingEmployee.id ? editingEmployee : e)))
      setEditingEmployee(null)
    }
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id))
  }

  const handleRoleChange = (employeeId: string, newRoleId: string) => {
    const role = roles.find((r) => r.id === newRoleId)
    if (role) {
      setEmployees(
        employees.map((e) =>
          e.id === employeeId
            ? {
                ...e,
                role: newRoleId as Employee["role"],
                permissions: role.permissions,
              }
            : e,
        ),
      )
    }
  }

  const handleAddRole = () => {
    const role: Role = {
      ...newRole,
      id: newRole.name.toLowerCase().replace(/\s+/g, "-"),
    }
    setRoles([...roles, role])
    setNewRole({
      name: "",
      description: "",
      permissions: {
        sales: false,
        inventory: false,
        customers: false,
        reports: false,
        settings: false,
        employees: false,
      },
    })
    setIsRoleDialogOpen(false)
  }

  const getRoleInfo = (roleId: string) => {
    return roles.find((r) => r.id === roleId) || roles[0]
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="employees" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Employee Management</h2>
            <p className="text-muted-foreground">Manage employees, roles, and permissions</p>
          </div>
          <TabsList>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="employees" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPins(!showPins)} className="flex items-center gap-2">
                {showPins ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPins ? "Hide PINs" : "Show PINs"}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>Add a new employee to your team</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newEmployee.lastName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value) => {
                          const role = roles.find((r) => r.id === value)
                          setNewEmployee({
                            ...newEmployee,
                            role: value as Employee["role"],
                            permissions: role?.permissions || newEmployee.permissions,
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        value={newEmployee.hourlyRate}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, hourlyRate: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={newEmployee.hireDate}
                        onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pin">PIN (4 digits)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pin"
                          value={newEmployee.pin}
                          onChange={(e) => setNewEmployee({ ...newEmployee, pin: e.target.value })}
                          maxLength={4}
                          placeholder="1234"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setNewEmployee({ ...newEmployee, pin: generatePin() })}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddEmployee} className="w-full">
                    Add Employee
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Employee Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <User className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((e) => e.status === "active").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((e) => e.role === "admin").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
          </div>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    {showPins && <TableHead>PIN</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => {
                    const roleInfo = getRoleInfo(employee.role)
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline">{roleInfo.name}</Badge>
                            <div className="text-xs text-muted-foreground mt-1">${employee.hourlyRate}/hr</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{employee.phone}</div>
                        </TableCell>
                        <TableCell>{employee.hireDate}</TableCell>
                        <TableCell>
                          <div className="text-sm">{employee.lastLogin}</div>
                        </TableCell>
                        {showPins && (
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{employee.pin}</code>
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Roles & Permissions</h3>
              <p className="text-sm text-muted-foreground">Manage user roles and their permissions</p>
            </div>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>Create a new role with custom permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Input
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="space-y-3 mt-2">
                      {Object.entries(newRole.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key} className="capitalize">
                            {key}
                          </Label>
                          <Switch
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setNewRole({
                                ...newRole,
                                permissions: { ...newRole.permissions, [key]: checked },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddRole} className="w-full">
                    Add Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {role.name}
                    <Badge variant="outline">{employees.filter((e) => e.role === role.id).length} users</Badge>
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Permissions:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(role.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${value ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-sm capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information and permissions</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editingEmployee.firstName}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editingEmployee.lastName}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingEmployee.phone}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editingEmployee.role}
                    onValueChange={(value) => handleRoleChange(editingEmployee.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingEmployee.status}
                    onValueChange={(value) =>
                      setEditingEmployee({ ...editingEmployee, status: value as Employee["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    step="0.01"
                    value={editingEmployee.hourlyRate}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, hourlyRate: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pin">PIN</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-pin"
                      value={editingEmployee.pin}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, pin: e.target.value })}
                      maxLength={4}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingEmployee({ ...editingEmployee, pin: generatePin() })}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Custom Permissions</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(editingEmployee.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`edit-${key}`} className="capitalize">
                        {key}
                      </Label>
                      <Switch
                        id={`edit-${key}`}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            permissions: { ...editingEmployee.permissions, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleUpdateEmployee} className="w-full">
                Update Employee
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
