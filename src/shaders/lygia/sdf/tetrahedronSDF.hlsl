/*
original_author:  Inigo Quiles
description: generate the SDF of a tetrahedron
use: <float> tetrahedronSDF( in <float3> pos, in <float> h ) 
*/

#ifndef FNC_TETRAHEDRONSDF
#define FNC_TETRAHEDRONSDF
float tetrahedronSDF(float3 p, float h)  {
    float3 q = abs(p);
    
    float y = p.y;
    float d1 = q.z-max(0.,y);
    float d2 = max(q.x*.5 + y*.5,.0) - min(h, h+y);
    return length(max(float2(d1,d2),.005)) + min(max(d1,d2), 0.0);
}
#endif