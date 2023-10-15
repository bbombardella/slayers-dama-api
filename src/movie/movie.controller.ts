import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDto } from './models/movie.dto';
import { Movie, Role } from '@prisma/client';
import { PaginatedResult, PaginateOptions } from '../prisma/paginator';
import { MovieDetails } from '../tmdb-api/models';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all movies with pagination results',
  })
  findAll(@Query() pageable: PaginateOptions): Promise<PaginatedResult<Movie>> {
    return this.movieService.findAll(pageable);
  }

  @Get('tmdb/:id')
  @ApiOperation({
    summary: 'Retrieve movie information from The Movie Database',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  findOneTmdb(@Param('id', ParseIntPipe) id: number): Promise<MovieDetails> {
    return this.movieService.findOneTmdb(id);
  }

  @Post('tmdb/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new movie with data extracted from The Movie Database',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  create(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.create(id);
  }

  @Patch(':id/genre')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Add new genres to the movie',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  attachGenre(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() ids: number[],
  ): Promise<Movie> {
    return this.movieService.attachGenre(movieId, ids);
  }

  @Delete(':id/genre')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Remove genres to the movie',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  detachGenre(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() ids: number[],
  ): Promise<Movie> {
    return this.movieService.detachGenre(movieId, ids);
  }

  @Get('search/:query')
  @ApiOperation({
    summary: 'Search movie in database. Results with pagination',
  })
  @ApiParam({
    name: 'query',
    description: 'The search pattern',
    required: true,
  })
  search(@Param('query') query: string): Promise<PaginatedResult<Movie>> {
    return this.movieService.search(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MovieDto,
  ): Promise<Movie> {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.delete(id);
  }
}