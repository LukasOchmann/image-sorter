/// <reference types="node" />
import { Writable, Readable } from "stream";
import { ChildProcess } from "child_process";
/**
 * Exif data type.
 */
export declare type ExifData = ReadonlyArray<Record<string, any>>;
/**
 * Exec interface for `exiftool`.
 */
export declare class Exec extends Writable {
    process: ChildProcess;
    pending: number;
    constructor(args: string[], pending: number);
    _write(chunk: Buffer, encoding: string, cb: (error?: Error | null) => void): boolean | void;
    _destroy(): void;
    _final(): void | undefined;
    command(...args: string[]): void;
    close(): void;
    execute(...args: string[]): void;
    send(...args: string[]): Promise<ExifData>;
    read(readable: Readable, ...args: string[]): Promise<ExifData>;
}
/**
 * Handle `-stay_open` arguments.
 */
export declare function open(): Exec;
/**
 * Execute a command, returning on data.
 */
export declare function exec(...args: string[]): Exec;
