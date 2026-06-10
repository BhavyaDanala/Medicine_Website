using MediatR;
using MedicineService.Models;

namespace MedicineService.Features.Medicines.Queries
{
    public class GetAllMedicinesQuery: IRequest<List<Medicine>>
    {
    }
}